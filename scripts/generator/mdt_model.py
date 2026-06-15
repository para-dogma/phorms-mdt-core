from pydantic import BaseModel, Field
from typing import List, Optional
import hashlib

class VectorData(BaseModel):
    """Базовая структура для одного вектора"""
    name: str = Field(..., description="Название вектора")
    value: str = Field(..., description="Хешированное значение")
    metadata: Optional[dict] = Field(default_factory=dict, description="Дополнительные метаданные")

class MDTConfig(BaseModel):
    """Конфигурация Multidimensional Token"""
    token_id: str = Field(..., description="Уникальный ID токена")
    vectors: List[VectorData] = Field(..., min_items=5, max_items=5, description="Ровно 5 векторов")
    merkle_root: str = Field(..., description="Корневой хеш Меркла всех векторов")
    
    class Config:
        frozen = True  # Неизменяемость после создания
