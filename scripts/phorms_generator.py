"""PhormS MDT Generator
Core generator for Multidimensional Tokens (MDT) on TON blockchain.
Implements 5-vector Merkle root system with ML-based anomaly detection.

Author: PhormS Team
License: MIT
"""

import warnings
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, validator
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler


# ============================================================================
# Enums for Type Safety
# ============================================================================

class LegalStatus(int, Enum):
    """Legal status enumeration for RWA compliance."""
    PENDING = 0
    APPROVED = 1
    RESTRICTED = 2


class AuditStatus(int, Enum):
    """Audit status enumeration for quality validation."""
    PENDING = 0
    PASSED = 1
    FAILED = 2


# ============================================================================
# Pydantic Models - 5-Vector System
# ============================================================================

class IdentityRoot(BaseModel):
    """Identity Vector: Core identifier and ownership metadata."""
    token_id: int = Field(..., ge=1, description="Unique token identifier")
    owner: str = Field(..., description="Owner address (TON format)")
    minter: str = Field(..., description="Minter address (TON format)")
    created_at: Optional[int] = Field(None, description="Creation timestamp (auto-populated)")

    class Config:
        description = "Identity Root - ownership and core identification"


class StateRoot(BaseModel):
    """State Vector: Current operational state."""
    is_active: bool = Field(True, description="Token is active and operational")
    generation: int = Field(0, ge=0, description="Generation level (0 for root tokens)")
    parent_id: int = Field(0, ge=0, description="Parent token ID (0 for root tokens)")
    total_supply: int = Field(..., gt=0, description="Total token supply")

    class Config:
        description = "State Root - operational status and lineage"


class QualityRoot(BaseModel):
    """Quality Vector: Token quality and validation metrics."""
    quality_score: int = Field(100, ge=0, le=100, description="Quality score (0-100)")
    audit_status: AuditStatus = Field(AuditStatus.PENDING, description="Audit status")
    verification_count: int = Field(0, ge=0, description="Number of verifications")

    class Config:
        description = "Quality Root - asset quality and audit metrics"


class LegalRoot(BaseModel):
    """Legal Vector: Legal and compliance metadata."""
    legal_status: LegalStatus = Field(LegalStatus.PENDING, description="Legal status")
    compliance_hash: int = Field(0, ge=0, description="Compliance hash value")
    jurisdiction_code: int = Field(0, ge=0, description="Jurisdiction code")

    class Config:
        description = "Legal Root - legal status and compliance"


class LineageRoot(BaseModel):
    """Lineage Vector: Ancestry and split history."""
    lineage_depth: int = Field(0, ge=0, description="Depth in token lineage")
    split_count: int = Field(0, ge=0, description="Number of splits performed")

    class Config:
        description = "Lineage Root - token ancestry and split history"


class MDTConfig(BaseModel):
    """
    Multidimensional Token Configuration.
    Represents the complete 5-vector system for token generation.
    """
    # 5-Vector System
    identity: IdentityRoot
    state: StateRoot
    quality: QualityRoot
    legal: LegalRoot
    lineage: LineageRoot

    # Metadata
    asset_name: str = Field("RWA Token", description="Human-readable asset name")
    asset_description: str = Field("", description="Asset description")
    time_lock_threshold: int = Field(2592000, description="Time-lock threshold in seconds (30 days)")

    @validator("identity", pre=True, always=True)
    def auto_timestamp(cls, v):
        """Auto-populate creation timestamp if not provided."""
        if isinstance(v, dict) and v.get("created_at") is None:
            v["created_at"] = int(datetime.now().timestamp())
        return v

    class Config:
        description = "MDT Configuration - 5-vector Merkle root system"
        json_schema_extra = {
            "example": {
                "asset_name": "Premium Coffee Batch",
                "asset_description": "Ethically sourced Ethiopian coffee batch #2024-Q2",
                "identity": {
                    "token_id": 1,
                    "owner": "UQDhCKXjQzLPQPbZkIXYp1XkDXEm0qYx8s_V3pJp3Tp9D9aA",
                    "minter": "UQDhCKXjQzLPQPbZkIXYp1XkDXEm0qYx8s_V3pJp3Tp9D9aA",
                },
                "state": {
                    "is_active": True,
                    "generation": 0,
                    "parent_id": 0,
                    "total_supply": 1000,
                },
                "quality": {
                    "quality_score": 95,
                    "audit_status": 0,
                    "verification_count": 0,
                },
                "legal": {
                    "legal_status": 1,
                    "compliance_hash": 12345,
                    "jurisdiction_code": 840,  # USA
                },
                "lineage": {
                    "lineage_depth": 0,
                    "split_count": 0,
                },
            }
        }


# ============================================================================
# ML-Based Anomaly Detector
# ============================================================================

class MDTAnomalyDetector:
    """
    ML-based anomaly detector for MDT configurations.
    Uses a trained neural network to identify anomalous token configurations.
    """

    def __init__(self):
        """Initialize the anomaly detector with a pre-trained model."""
        self.model = MLPClassifier(
            hidden_layer_sizes=(16, 8),
            activation="relu",
            solver="adam",
            max_iter=1000,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.1,
        )
        self.scaler = StandardScaler()
        self._is_trained = False

    def train(self, X_normal: np.ndarray):
        """
        Train the detector on normal (non-anomalous) samples.

        Args:
            X_normal: Array of normal samples, shape (n_samples, n_features)
        """
        # Create synthetic dataset: normal samples (label=0) and anomalies (label=1)
        n_samples = len(X_normal)
        X_anomalies = self._generate_anomalies(X_normal)

        X_train = np.vstack([X_normal, X_anomalies])
        y_train = np.hstack([np.zeros(n_samples), np.ones(n_samples)])

        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        self._is_trained = True

    def predict(self, X: np.ndarray) -> bool:
        """
        Predict if a sample is anomalous.

        Args:
            X: Sample to evaluate, shape (1, n_features)

        Returns:
            True if anomalous, False if normal
        """
        if not self._is_trained:
            raise RuntimeError("Detector not trained. Call train() first.")

        X_scaled = self.scaler.transform(X)
        return bool(self.model.predict(X_scaled)[0])

    @staticmethod
    def _generate_anomalies(X_normal: np.ndarray, factor: float = 2.0) -> np.ndarray:
        """Generate synthetic anomalies by scaling normal samples."""
        return X_normal * factor + np.random.normal(0, 0.5, X_normal.shape)


def create_and_train_detector() -> MDTAnomalyDetector:
    """
    Create and train a default anomaly detector with realistic MDT patterns.

    Returns:
        Trained MDTAnomalyDetector instance
    """
    detector = MDTAnomalyDetector()

    # Generate normal MDT feature vectors
    # Features: [quality_score, generation, total_supply, split_count, verification_count]
    normal_samples = np.array([
        [95, 0, 1000, 0, 0],      # Fresh premium token
        [90, 1, 600, 1, 2],       # First generation split
        [85, 2, 400, 2, 3],       # Second generation
        [88, 0, 500, 0, 1],       # Another root token
        [92, 1, 300, 1, 1],       # Split token
        [80, 3, 150, 3, 5],       # Deep lineage
    ])

    detector.train(normal_samples)
    return detector


# ============================================================================
# Tact Code Generator
# ============================================================================

class MDTTactGenerator:
    """Generator for Tact smart contract code from MDT configuration."""

    TACT_TEMPLATE = '''import "@stdlib/deploy";
import "@stdlib/ownable";

//
// Message Definitions for {asset_name}
//

message SplitMsg {{
    amount1: Int;
    amount2: Int;
}}

message UpdateQualityMsg {{
    quality_score: Int;
    audit_status: Int;
}}

message UpdateLegalMsg {{
    legal_status: Int;
    compliance_hash: Int;
}}

//
// Data Vector Structs - Five-Dimensional Root System
//

/// Identity Root: Core identifier and ownership metadata
struct IdentityRoot {{
    token_id: Int;
    owner: Address;
    minter: Address;
    created_at: Int;
}}

/// State Root: Current operational state
struct StateRoot {{
    is_active: Bool;
    generation: Int;
    parent_id: Int;
    total_supply: Int;
}}

/// Quality Root: Token quality and validation metrics
struct QualityRoot {{
    quality_score: Int;
    audit_status: Int;
    verification_count: Int;
}}

/// Legal Root: Legal and compliance metadata
struct LegalRoot {{
    legal_status: Int;
    compliance_hash: Int;
    jurisdiction_code: Int;
}}

/// Lineage Root: Ancestry and split history
struct LineageRoot {{
    lineage_depth: Int;
    split_count: Int;
}}

//
// Main {asset_name} Contract
//

contract {contract_name} with Deployable, Ownable {{
    
    // Core Data Vectors
    identity: IdentityRoot;
    state: StateRoot;
    quality: QualityRoot;
    legal: LegalRoot;
    lineage: LineageRoot;
    
    // Time-lock for honesty enforcement
    last_update: Int;
    
    // Constants
    const STALE_THRESHOLD: Int = {time_lock_threshold};
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
    ) {{
        let now_ts = now();
        
        // Initialize Identity Vector
        self.identity = IdentityRoot{{
            token_id: token_id,
            owner: owner,
            minter: minter,
            created_at: now_ts
        }};
        
        // Initialize State Vector
        self.state = StateRoot{{
            is_active: true,
            generation: generation,
            parent_id: parent_id,
            total_supply: total_supply
        }};
        
        // Initialize Quality Vector
        self.quality = QualityRoot{{
            quality_score: {quality_score},
            audit_status: {audit_status},
            verification_count: 0
        }};
        
        // Initialize Legal Vector
        self.legal = LegalRoot{{
            legal_status: {legal_status},
            compliance_hash: {compliance_hash},
            jurisdiction_code: {jurisdiction_code}
        }};
        
        // Initialize Lineage Vector
        self.lineage = LineageRoot{{
            lineage_depth: generation,
            split_count: 0
        }};
        
        // Time-lock initialization
        self.last_update = now_ts;
        
        // Set contract owner
        self.owner = owner;
    }}
    
    //
    // Hard Split Logic with Time-Lock
    //
    
    receive(msg: SplitMsg) {{
        // Ownership check
        require(sender() == self.owner, "Only owner can initiate split");
        
        // State validation
        require(self.state.is_active, "Token is burned");
        
        // Amount validation
        require(msg.amount1 >= self.MIN_SPLIT_AMOUNT && msg.amount2 >= self.MIN_SPLIT_AMOUNT, "Below minimum dust limit");
        require(msg.amount1 + msg.amount2 == self.state.total_supply, "Split amounts must equal total supply");
        
        // Time-Lock: Enforce {time_lock_threshold} second honesty window
        let elapsed: Int = now() - self.last_update;
        require(elapsed < self.STALE_THRESHOLD, "Token is STALE");
        
        // Burn Parent Token
        self.state.is_active = false;
        
        // Update lineage
        self.lineage.split_count = self.lineage.split_count + 1;
        
        // Emit split event
        emit_log_simple(self.OP_SPLIT_EVENT, beginCell().storeInt(msg.amount1, 257).storeInt(msg.amount2, 257).endCell());
        
        self.last_update = now();
    }}
    
    //
    // Quality Vector Update
    //
    
    receive(msg: UpdateQualityMsg) {{
        require(sender() == self.owner, "Access denied");
        require(msg.quality_score >= 0 && msg.quality_score <= 100, "Quality score must be 0-100");
        
        self.quality.quality_score = msg.quality_score;
        self.quality.audit_status = msg.audit_status;
        self.quality.verification_count = self.quality.verification_count + 1;
        self.last_update = now();
    }}
    
    //
    // Legal Vector Update
    //
    
    receive(msg: UpdateLegalMsg) {{
        require(sender() == self.owner, "Access denied");
        
        self.legal.legal_status = msg.legal_status;
        self.legal.compliance_hash = msg.compliance_hash;
        self.last_update = now();
    }}
    
    //
    // Getter Functions
    //
    
    get fun getState(): StateRoot {{
        return self.state;
    }}
    
    get fun getIdentity(): IdentityRoot {{
        return self.identity;
    }}
    
    get fun getQuality(): QualityRoot {{
        return self.quality;
    }}
    
    get fun getLegal(): LegalRoot {{
        return self.legal;
    }}
    
    get fun getLineage(): LineageRoot {{
        return self.lineage;
    }}
    
    get fun isStale(): Bool {{
        return (now() - self.last_update) >= self.STALE_THRESHOLD;
    }}
    
    get fun getTimeSinceLastUpdate(): Int {{
        return now() - self.last_update;
    }}
    
    get fun getTimeUntilStale(): Int {{
        let elapsed: Int = now() - self.last_update;
        if (elapsed >= self.STALE_THRESHOLD) {{
            return 0;
        }}
        return self.STALE_THRESHOLD - elapsed;
    }}
    
    get fun isActive(): Bool {{
        return self.state.is_active;
    }}
    
    get fun getGeneration(): Int {{
        return self.state.generation;
    }}
    
    get fun getTotalSupply(): Int {{
        return self.state.total_supply;
    }}
}}
'''

    @staticmethod
    def generate_tact_code(config: MDTConfig) -> str:
        """
        Generate Tact smart contract code from MDT configuration.

        Args:
            config: MDTConfig instance with all 5 vectors configured

        Returns:
            Tact source code as a string
        """
        # Sanitize asset name for contract name (CamelCase, no spaces)
        contract_name = "".join(word.capitalize() for word in config.asset_name.split())
        if not contract_name:
            contract_name = "MultidimensionalToken"

        # Format the template
        tact_code = MDTTactGenerator.TACT_TEMPLATE.format(
            asset_name=config.asset_name,
            contract_name=contract_name,
            time_lock_threshold=config.time_lock_threshold,
            quality_score=config.quality.quality_score,
            audit_status=config.quality.audit_status.value,
            legal_status=config.legal.legal_status.value,
            compliance_hash=config.legal.compliance_hash,
            jurisdiction_code=config.legal.jurisdiction_code,
        )

        return tact_code


# ============================================================================
# Type Converter
# ============================================================================

class PythonToTactConverter:
    """Convert Python types to Tact types."""

    @staticmethod
    def convert_value(py_value: Any, tact_type: str) -> str:
        """
        Convert a Python value to its Tact representation.

        Args:
            py_value: Python value to convert
            tact_type: Target Tact type (e.g., 'Bool', 'Int', 'Address')

        Returns:
            Tact-formatted string representation
        """
        if tact_type == "Bool":
            return "true" if bool(py_value) else "false"
        elif tact_type == "Int":
            return f"{int(py_value)}"
        elif tact_type == "Address":
            return f'"{str(py_value)}"'
        elif tact_type == "String":
            return f'"{str(py_value)}"'
        else:
            return str(py_value)


# ============================================================================
# Main Demo
# ============================================================================

def main():
    """
    Demonstrate MDT generation for a Real World Asset.
    Example: Premium coffee batch with full compliance tracking.
    """
    print("=" * 80)
    print("PhormS MDT Generator - Real World Asset Example")
    print("=" * 80)
    print()

    # Create configuration for a premium coffee batch
    coffee_config = MDTConfig(
        asset_name="Premium Ethiopian Coffee Batch 2024-Q2",
        asset_description="Ethically sourced premium Yirgacheffe beans, 500kg batch",
        identity=IdentityRoot(
            token_id=1001,
            owner="UQDhCKXjQzLPQPbZkIXYp1XkDXEm0qYx8s_V3pJp3Tp9D9aA",
            minter="UQDhCKXjQzLPQPbZkIXYp1XkDXEm0qYx8s_V3pJp3Tp9D9aA",
        ),
        state=StateRoot(
            is_active=True,
            generation=0,
            parent_id=0,
            total_supply=500,  # 500 kg batch
        ),
        quality=QualityRoot(
            quality_score=96,
            audit_status=AuditStatus.PASSED,
            verification_count=0,
        ),
        legal=LegalRoot(
            legal_status=LegalStatus.APPROVED,
            compliance_hash=0xCAFEBABE,
            jurisdiction_code=231,  # Ethiopia
        ),
        lineage=LineageRoot(
            lineage_depth=0,
            split_count=0,
        ),
        time_lock_threshold=2592000,  # 30 days
    )

    print("📦 Token Configuration (JSON):")
    print("-" * 80)
    print(coffee_config.model_dump_json(indent=2))
    print()

    # Initialize and train anomaly detector
    print("🤖 Training ML Anomaly Detector...")
    print("-" * 80)
    detector = create_and_train_detector()
    print("✓ Detector trained successfully")
    print()

    # Check for anomalies
    print("🔍 Anomaly Detection:")
    print("-" * 80)
    feature_vector = np.array([
        [
            coffee_config.quality.quality_score,
            coffee_config.state.generation,
            coffee_config.state.total_supply,
            coffee_config.lineage.split_count,
            coffee_config.quality.verification_count,
        ]
    ])

    is_anomalous = detector.predict(feature_vector)
    if is_anomalous:
        warnings.warn(
            "⚠️  Anomalous configuration detected! Token metrics deviate from normal patterns.",
            UserWarning,
        )
    else:
        print("✓ Configuration is within normal parameters")
    print()

    # Generate Tact code
    print("📝 Generating Tact Smart Contract:")
    print("-" * 80)
    tact_code = MDTTactGenerator.generate_tact_code(coffee_config)
    print(tact_code)
    print()

    # Summary
    print("=" * 80)
    print("✓ Generation Complete")
    print("=" * 80)
    print(f"Asset: {coffee_config.asset_name}")
    print(f"Supply: {coffee_config.state.total_supply} units")
    print(f"Quality Score: {coffee_config.quality.quality_score}/100")
    print(f"Legal Status: {coffee_config.legal.legal_status.name}")
    print(f"Time-Lock Window: {coffee_config.time_lock_threshold} seconds ({coffee_config.time_lock_threshold / 86400:.0f} days)")
    print()


if __name__ == "__main__":
    main()
