import "@stdlib/deploy";
import "@stdlib/ownable";

//
// Message Definitions for Premium Ethiopian Coffee Batch 2024-Q2
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
    parent_id: Int;
    total_supply: Int;
}

/// Quality Root: Token quality and validation metrics
struct QualityRoot {
    quality_score: Int;
    audit_status: Int;
    verification_count: Int;
}

/// Legal Root: Legal and compliance metadata
struct LegalRoot {
    legal_status: Int;
    compliance_hash: Int;
    jurisdiction_code: Int;
}

/// Lineage Root: Ancestry and split history
struct LineageRoot {
    lineage_depth: Int;
    split_count: Int;
}

//
// Main Premium Ethiopian Coffee Batch 2024-Q2 Contract
//

contract PremiumEthiopianCoffeeBatch2024-q2 with Deployable, Ownable {
    
    // Core Data Vectors
    identity: IdentityRoot;
    state: StateRoot;
    quality: QualityRoot;
    legal: LegalRoot;
    lineage: LineageRoot;
    
    // Time-lock for honesty enforcement
    last_update: Int;
    
    // Constants
    const STALE_THRESHOLD: Int = 2592000;
    const MIN_SPLIT_AMOUNT: Int = 1;
    const OP_SPLIT_EVENT: Int = 0x0001;
    
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
            quality_score: 96,
            audit_status: 1,
            verification_count: 0
        };
        
        // Initialize Legal Vector
        self.legal = LegalRoot{
            legal_status: 1,
            compliance_hash: 3405691582,
            jurisdiction_code: 231
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
        
        // Time-Lock: Enforce 2592000 second honesty window
        let elapsed: Int = now() - self.last_update;
        require(elapsed < self.STALE_THRESHOLD, "Token is STALE");
        
        // Burn Parent Token
        self.state.is_active = false;
        
        // Update lineage
        self.lineage.split_count = self.lineage.split_count + 1;
        
        // Emit split event
        emit_log_simple(self.OP_SPLIT_EVENT, beginCell().storeInt(msg.amount1, 257).storeInt(msg.amount2, 257).endCell());
        
        self.last_update = now();
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
    
    get fun getState(): StateRoot {
        return self.state;
    }
    
    get fun getIdentity(): IdentityRoot {
        return self.identity;
    }
    
    get fun getQuality(): QualityRoot {
        return self.quality;
    }
    
    get fun getLegal(): LegalRoot {
        return self.legal;
    }
    
    get fun getLineage(): LineageRoot {
        return self.lineage;
    }
    
    get fun isStale(): Bool {
        return (now() - self.last_update) >= self.STALE_THRESHOLD;
    }
    
    get fun getTimeSinceLastUpdate(): Int {
        return now() - self.last_update;
    }
    
    get fun getTimeUntilStale(): Int {
        let elapsed: Int = now() - self.last_update;
        if (elapsed >= self.STALE_THRESHOLD) {
            return 0;
        }
        return self.STALE_THRESHOLD - elapsed;
    }
    
    get fun isActive(): Bool {
        return self.state.is_active;
    }
    
    get fun getGeneration(): Int {
        return self.state.generation;
    }
    
    get fun getTotalSupply(): Int {
        return self.state.total_supply;
    }
}
