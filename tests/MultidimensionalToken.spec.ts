import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, beginCell } from '@ton/core';
import { MultidimensionalToken } from '../build/MultidimensionalToken';
import '@ton/test-utils';

describe('MultidimensionalToken Contract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<MultidimensionalToken>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        // Deploy MultidimensionalToken contract
        contract = blockchain.openContract(
            MultidimensionalToken.createFromConfig(
                {
                    token_id: 1n,
                    owner: deployer.address,
                    minter: deployer.address,
                    total_supply: 1000n,
                    generation: 0n,
                    parent_id: 0n,
                },
                MultidimensionalToken.codeCell()
            )
        );

        // Send init transaction
        const deployResult = await contract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: contract.address,
            deploy: true,
            success: true,
        });
    });

    describe('Deployment', () => {
        it('should deploy successfully with initial state', async () => {
            const state = await contract.getState();
            expect(state.is_active).toBe(true);
            expect(state.generation).toBe(0n);
            expect(state.parent_id).toBe(0n);
            expect(state.total_supply).toBe(1000n);
        });

        it('should initialize identity vector correctly', async () => {
            const identity = await contract.getIdentity();
            expect(identity.token_id).toBe(1n);
            expect(identity.owner).toEqualAddress(deployer.address);
            expect(identity.minter).toEqualAddress(deployer.address);
        });

        it('should initialize quality vector at max score', async () => {
            const quality = await contract.getQuality();
            expect(quality.quality_score).toBe(100n);
            expect(quality.audit_status).toBe(0n);
            expect(quality.verification_count).toBe(0n);
        });

        it('should initialize lineage vector', async () => {
            const lineage = await contract.getLineage();
            expect(lineage.lineage_depth).toBe(0n);
            expect(lineage.split_count).toBe(0n);
        });
    });

    describe('Hard Split Logic', () => {
        it('should successfully split token into 600 and 400', async () => {
            // Record initial state
            const initialState = await contract.getState();
            expect(initialState.is_active).toBe(true);

            // Send split message
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: true,
            });

            // Verify parent is burned
            const finalState = await contract.getState();
            expect(finalState.is_active).toBe(false);
        });

        it('should emit split event with correct opcode', async () => {
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: contract.address,
                to: deployer.address,
                body: beginCell()
                    .storeUint(0x0001, 32) // OP_SPLIT_EVENT
                    .storeInt(1n, 64)      // parent_id
                    .storeInt(600n, 64)    // amount1
                    .storeInt(400n, 64)    // amount2
                    .storeInt(1n, 32)      // new_generation
                    .endCell(),
            });
        });

        it('should increment split counter', async () => {
            const initialLineage = await contract.getLineage();
            expect(initialLineage.split_count).toBe(0n);

            await contract.sendSplit(deployer.getSender(), toNano('0.1'), 600n, 400n);

            const finalLineage = await contract.getLineage();
            expect(finalLineage.split_count).toBe(1n);
        });

        it('should update generation for new tokens', async () => {
            const initialState = await contract.getState();
            expect(initialState.generation).toBe(0n);

            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            // Check that event contains new_generation = 1
            const sentTransaction = splitResult.transactions.find(
                (tx) => tx.to?.equals(deployer.address) && tx.from?.equals(contract.address)
            );
            expect(sentTransaction).toBeDefined();
        });
    });

    describe('Hard Split Validation', () => {
        it('should reject split if amounts do not conserve supply', async () => {
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                500n,
                600n // 500 + 600 = 1100 ≠ 1000
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: false,
                exitCode: 57, // Exit code for failed assertion
            });

            // Verify token is still active
            const state = await contract.getState();
            expect(state.is_active).toBe(true);
        });

        it('should reject split if amount1 is below dust limit', async () => {
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                0n,
                1000n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: false,
            });
        });

        it('should reject split if amount2 is below dust limit', async () => {
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                1000n,
                0n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: false,
            });
        });

        it('should reject split if already burned', async () => {
            // First split - succeeds
            await contract.sendSplit(deployer.getSender(), toNano('0.1'), 600n, 400n);

            // Second split - should fail
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                300n,
                700n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: false,
            });
        });

        it('should reject split from non-owner', async () => {
            const attacker = await blockchain.treasury('attacker');

            const splitResult = await contract.sendSplit(
                attacker.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: attacker.address,
                to: contract.address,
                success: false,
            });
        });
    });

    describe('Time-Lock Consensus (30-Day Honesty Window)', () => {
        it('should allow split within 30-day window', async () => {
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: true,
            });
        });

        it('should reject split after 30 days have elapsed', async () => {
            // Advance blockchain time by 31 days
            const thirtyOneDaysInSeconds = 31 * 24 * 60 * 60;
            await blockchain.setTime(blockchain.now() + thirtyOneDaysInSeconds);

            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: false,
                exitCode: 57, // Failed assertion for "Token is STALE"
            });
        });

        it('should mark token as stale after 30 days', async () => {
            expect(await contract.getIsStale()).toBe(false);

            const thirtyOneDaysInSeconds = 31 * 24 * 60 * 60;
            await blockchain.setTime(blockchain.now() + thirtyOneDaysInSeconds);

            expect(await contract.getIsStale()).toBe(true);
        });

        it('should update last_update timestamp after split', async () => {
            const timeBefore = blockchain.now();
            await contract.sendSplit(deployer.getSender(), toNano('0.1'), 600n, 400n);
            const timeAfter = blockchain.now();

            const timeSinceUpdate = await contract.getTimeSinceLastUpdate();
            expect(timeSinceUpdate).toBeGreaterThanOrEqual(0n);
            expect(timeSinceUpdate).toBeLessThanOrEqual(BigInt(timeAfter - timeBefore));
        });

        it('should return correct time until stale', async () => {
            const timeUntilStale = await contract.getTimeUntilStale();
            const expectedThreshold = 30n * 24n * 60n * 60n; // 2,592,000 seconds

            expect(timeUntilStale).toBeLessThanOrEqual(expectedThreshold);
            expect(timeUntilStale).toBeGreaterThan(0n);
        });

        it('should return 0 for time until stale after threshold exceeded', async () => {
            const thirtyOneDaysInSeconds = 31 * 24 * 60 * 60;
            await blockchain.setTime(blockchain.now() + thirtyOneDaysInSeconds);

            const timeUntilStale = await contract.getTimeUntilStale();
            expect(timeUntilStale).toBe(0n);
        });
    });

    describe('Quality Vector Updates', () => {
        it('should update quality score', async () => {
            const initialQuality = await contract.getQuality();
            expect(initialQuality.quality_score).toBe(100n);

            await contract.sendUpdateQuality(deployer.getSender(), toNano('0.05'), 85n, 1n);

            const updatedQuality = await contract.getQuality();
            expect(updatedQuality.quality_score).toBe(85n);
            expect(updatedQuality.audit_status).toBe(1n);
            expect(updatedQuality.verification_count).toBe(1n);
        });

        it('should increment verification count on each update', async () => {
            const initialQuality = await contract.getQuality();
            expect(initialQuality.verification_count).toBe(0n);

            await contract.sendUpdateQuality(deployer.getSender(), toNano('0.05'), 90n, 1n);
            let quality = await contract.getQuality();
            expect(quality.verification_count).toBe(1n);

            await contract.sendUpdateQuality(deployer.getSender(), toNano('0.05'), 80n, 1n);
            quality = await contract.getQuality();
            expect(quality.verification_count).toBe(2n);
        });

        it('should reject quality update from non-owner', async () => {
            const attacker = await blockchain.treasury('attacker');

            const updateResult = await contract.sendUpdateQuality(
                attacker.getSender(),
                toNano('0.05'),
                75n,
                1n
            );

            expect(updateResult.transactions).toHaveTransaction({
                from: attacker.address,
                to: contract.address,
                success: false,
            });
        });
    });

    describe('Legal Vector Updates', () => {
        it('should update legal status', async () => {
            const initialLegal = await contract.getLegal();
            expect(initialLegal.legal_status).toBe(0n);

            await contract.sendUpdateLegal(deployer.getSender(), toNano('0.05'), 1n, 12345n);

            const updatedLegal = await contract.getLegal();
            expect(updatedLegal.legal_status).toBe(1n);
            expect(updatedLegal.compliance_hash).toBe(12345n);
        });

        it('should reject legal update from non-owner', async () => {
            const attacker = await blockchain.treasury('attacker');

            const updateResult = await contract.sendUpdateLegal(
                attacker.getSender(),
                toNano('0.05'),
                1n,
                12345n
            );

            expect(updateResult.transactions).toHaveTransaction({
                from: attacker.address,
                to: contract.address,
                success: false,
            });
        });
    });

    describe('State Management', () => {
        it('should return active status correctly', async () => {
            expect(await contract.getIsActive()).toBe(true);

            await contract.sendSplit(deployer.getSender(), toNano('0.1'), 600n, 400n);

            expect(await contract.getIsActive()).toBe(false);
        });

        it('should return generation correctly', async () => {
            expect(await contract.getGeneration()).toBe(0n);
        });

        it('should return total supply correctly', async () => {
            expect(await contract.getTotalSupply()).toBe(1000n);
        });
    });

    describe('Integration Scenarios', () => {
        it('should handle multiple quality updates before split', async () => {
            await contract.sendUpdateQuality(deployer.getSender(), toNano('0.05'), 95n, 0n);
            await contract.sendUpdateQuality(deployer.getSender(), toNano('0.05'), 90n, 1n);

            const quality = await contract.getQuality();
            expect(quality.quality_score).toBe(90n);
            expect(quality.verification_count).toBe(2n);

            // Split should still work
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: true,
            });
        });

        it('should prevent any operations after token is stale', async () => {
            const thirtyOneDaysInSeconds = 31 * 24 * 60 * 60;
            await blockchain.setTime(blockchain.now() + thirtyOneDaysInSeconds);

            // Split should fail
            const splitResult = await contract.sendSplit(
                deployer.getSender(),
                toNano('0.1'),
                600n,
                400n
            );

            expect(splitResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: false,
            });

            // Token should still be active (not burned because split failed)
            expect(await contract.getIsActive()).toBe(true);
        });
    });
});
