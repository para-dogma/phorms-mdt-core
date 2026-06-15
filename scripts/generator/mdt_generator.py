import uuid
import hashlib
import json
from typing import Dict, Any
from .mdt_model import MDTConfig, VectorData
from .ml_validator import MDTValidator

class MDTGenerator:
    """Генератор Multidimensional Tokens с ML-валидацией"""
    
    VECTOR_NAMES = ["Identity", "State", "Quality", "Legal", "Lineage"]
    
    def __init__(self):
        self.validator = MDTValidator()
        
    def _hash_value(self, data: str) -> str:
        return hashlib.sha256(data.encode()).hexdigest()
        
    def _generate_vector(self, name: str) -> VectorData:
        raw_data = f"{name}_{uuid.uuid4().hex[:8]}"
        return VectorData(
            name=name,
            value=self._hash_value(raw_data),
            metadata={"source": "ml_validated_generator", "raw_hash": raw_data}
        )
        
    def generate_token(self) -> MDTConfig:
        """Генерация токена с автоматической ML-проверкой"""
        vectors = [self._generate_vector(name) for name in self.VECTOR_NAMES]
        
        # ML Quality Gate
        validation_result = self.validator.validate(vectors)
        
        if not validation_result["is_valid"]:
            print(" Regenerating token due to ML validation failure...")
            return self.generate_token()  # Рекурсивная перегенерация
            
        # Вычисляем Merkle Root
        combined = "".join([v.value for v in vectors])
        merkle_root = self._hash_value(combined)
        
        return MDTConfig(            token_id=str(uuid.uuid4()),
            vectors=vectors,
            merkle_root=merkle_root
        )
        
    def export_to_json(self, config: MDTConfig, filename: str = "generated_mdt.json"):
        with open(filename, 'w') as f:
            json.dump(config.model_dump(), f, indent=2)
        print(f"✅ Validated token exported to {filename}")
        return filename

if __name__ == "__main__":
    gen = MDTGenerator()
    token = gen.generate_token()
    print(f"Generated Token ID: {token.token_id}")
    print(f"Merkle Root: {token.merkle_root[:16]}...")
    gen.export_to_json(token)
