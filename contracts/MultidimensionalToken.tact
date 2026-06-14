import "@stdlib/deploy";
import "@stdlib/ownable";

//
// Message Definitions
//

message SplitMsg {
    amount1: Int;
    amount2: Int;
}

message UpdateQualityMsg {
    quality_score: Int;
    audit_status: Int;
}

message UpdateLegalMsg {
    legal_status: Int;
    compliance_hash: Int;
}

//
// Data Vector Structs - Five-Dimensional Root System
//

/// Identity Root: Core identifier and ownership metadata
struct IdentityRoot {
    token_id: Int;
    owner: Address;
    minter: Address;
    created_at: Int;
}

/// State Root: Current operational state
struct StateRoot {
    is_active: Bool;
    generation: Int;
    parent_id: Int;              // 0 for root tokens, parent_id otherwise
    total_supply: Int;
}

/// Quality Root: Token quality and validation metrics
struct QualityRoot {
    quality_score: Int;          // 0-100 scale
    audit_status: Int;           // 0=pending, 1=passed, 2=failed
    verification_count: Int;
}

/// Legal Root: Legal and compliance metadata
struct LegalRoot {
    legal_status: Int;           // 0=pending, 1=approved, 2=restricted
    compliance_hash: Int;
    jurisdiction_code: Int;
}

/// Lineage Root: Ancestry and split history
struct LineageRoot {
    lineage_depth: Int;
    split_count: Int;
}

//
// Main MultidimensionalToken Contract
//

contract MultidimensionalToken with Deployable, Ownable {
    
    // Core Data Vectors
    identity: IdentityRoot;
    state: StateRoot;
    quality: QualityRoot;
    legal: LegalRoot;
    lineage: LineageRoot;
    
    // Time-lock for honesty enforcement
    last_update: Int;
    
    // Constants
    const STALE_THRESHOLD: Int = 2592000;    // 30 days in seconds
    const MIN_SPLIT_AMOUNT: Int = 1;
    const OP_SPLIT_EVENT: Int = 0x0001;     // Event opcode for split
    
    //
    // Initialization
    //
    
    init(
        token_id: Int,
        owner: Address,
        minter: Address,
        total_supply: Int,
        generation: Int,
        parent_id: Int
    ) {
        let now_ts = now();
        
        // Initialize Identity Vector
        self.identity = IdentityRoot{
            token_id: token_id,
            owner: owner,
            minter: minter,
            created_at: now_ts
        };
        
        // Initialize State Vector
        self.state = StateRoot{
            is_active: true,
            generation: generation,
            parent_id: parent_id,
            total_supply: total_supply
        };
        
        // Initialize Quality Vector
        self.quality = QualityRoot{
            quality_score: 100,
            audit_status: 0,
            verification_count: 0
        };
        
        // Initialize Legal Vector
        self.legal = LegalRoot{
            legal_status: 0,
            compliance_hash: 0,
            jurisdiction_code: 0
        };
        
        // Initialize Lineage Vector
        self.lineage = LineageRoot{
            lineage_depth: generation,
            split_count: 0
        };
        
        // Time-lock initialization
        self.last_update = now_ts;
        
        // Set contract owner
        self.owner = owner;
    }
    
    //
    // Hard Split Logic with Time-Lock
    //
    
    receive(msg: SplitMsg) {
        // Ownership check
        require(sender() == self.owner, "Only owner can initiate split");
        
        // State validation
        require(self.state.is_active, "Token is burned");
        
        // Amount validation
        require(msg.amount1 >= self.MIN_SPLIT_AMOUNT && msg.amount2 >= self.MIN_SPLIT_AMOUNT, "Below minimum dust limit");
        require(msg.amount1 + msg.amount2 == self.state.total_supply, "Split amounts must equal total supply");
        
        // Time-Lock: Enforce 30-day honesty window
        let elapsed: Int = now() - self.last_update;
        require(elapsed < self.STALE_THRESHOLD, "Token is STALE");
        
        // Burn Parent Token
        self.state.is_active = false;
        
        // Update lineage
        self.lineage.split_count = self.lineage.split_count + 1;
        
        // Update time-lock timestamp
        self.last_update = now();
        
        // Emit Split Event for off-chain coordination
        // Event structure:
        // - opcode (32 bits): OP_SPLIT_EVENT
        // - parent_id (64 bits): this token's ID
        // - amount1 (64 bits): first child amount
        // - amount2 (64 bits): second child amount
        // - new_generation (32 bits): generation for children
        send(SendParameters{
            to: self.owner,
            value: ton("0.01"),
            mode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(self.OP_SPLIT_EVENT, 32)
                .storeInt(self.identity.token_id, 64)
                .storeInt(msg.amount1, 64)
                .storeInt(msg.amount2, 64)
                .storeInt(self.state.generation + 1, 32)
                .endCell()
        });
    }
    
    //
    // Quality Vector Update
    //
    
    receive(msg: UpdateQualityMsg) {
        require(sender() == self.owner, "Access denied");
        require(msg.quality_score >= 0 && msg.quality_score <= 100, "Quality score must be 0-100");
        
        self.quality.quality_score = msg.quality_score;
        self.quality.audit_status = msg.audit_status;
        self.quality.verification_count = self.quality.verification_count + 1;
        self.last_update = now();
    }
    
    //
    // Legal Vector Update
    //
    
    receive(msg: UpdateLegalMsg) {
        require(sender() == self.owner, "Access denied");
        
        self.legal.legal_status = msg.legal_status;
        self.legal.compliance_hash = msg.compliance_hash;
        self.last_update = now();
    }
    
    //
    // Getter Functions
    //
    
    /// Get current operational state vector
    get fun getState(): StateRoot {
        return self.state;
    }
    
    /// Get full identity information
    get fun getIdentity(): IdentityRoot {
        return self.identity;
    }
    
    /// Get quality metrics
    get fun getQuality(): QualityRoot {
        return self.quality;
    }
    
    /// Get legal status
    get fun getLegal(): LegalRoot {
        return self.legal;
    }
    
    /// Get lineage information
    get fun getLineage(): LineageRoot {
        return self.lineage;
    }
    
    /// Check if token is stale (exceeds 30-day window)
    get fun isStale(): Bool {
        return (now() - self.last_update) >= self.STALE_THRESHOLD;
    }
    
    /// Get time elapsed since last update (in seconds)
    get fun getTimeSinceLastUpdate(): Int {
        return now() - self.last_update;
    }
    
    /// Get seconds remaining until token becomes stale
    get fun getTimeUntilStale(): Int {
        let elapsed: Int = now() - self.last_update;
        if (elapsed >= self.STALE_THRESHOLD) {
            return 0;
        }
        return self.STALE_THRESHOLD - elapsed;
    }
    
    /// Check if token is active
    get fun isActive(): Bool {
        return self.state.is_active;
    }
    
    /// Get current generation level
    get fun getGeneration(): Int {
        return self.state.generation;
    }
    
    /// Get total supply
    get fun getTotalSupply(): Int {
        return self.state.total_supply;
    }
}
