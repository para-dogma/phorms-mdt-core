import json
from .mdt_generator import MDTGenerator

def prepare_mint_payload(token_json_path: str = "generated_mdt.json") -> dict:
    """Подготовка payload для вызова mint в контракте"""
    
    # Читаем сгенерированный токен
    with open(token_json_path, 'r') as f:
        token_data = json.load(f)
    
    # Формируем структуру для TON контракта
    # В реальном контракте это будет cell с boc-кодированием
    payload = {
        "op": "mint",  # OpCode для функции mint
        "token_id": token_data["token_id"],
        "merkle_root": token_data["merkle_root"],
        "vectors": [
            {
                "name": v["name"],
                "value": v["value"]
            } for v in token_data["vectors"]
        ],
        "query_id": 0  # Уникальный ID запроса (можно инкрементировать)
    }
    
    print("✅ Mint payload prepared:")
    print(json.dumps(payload, indent=2))
    
    return payload

if __name__ == "__main__":
    prepare_mint_payload()
