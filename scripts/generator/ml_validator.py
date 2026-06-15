import numpy as np
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Any
from .mdt_model import VectorData

class MDTValidator:
    """ML-валидатор для проверки качества векторов токена"""
    
    def __init__(self):
        # Простая модель изоляции для обнаружения аномалий
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False
        
    def _extract_features(self, vectors: List[VectorData]) -> np.ndarray:
        """Преобразует векторы в числовые признаки для ML"""
        features = []
        for v in vectors:
            # Используем длину хеша и сумму байт как простые метрики
            hash_val = int(v.value[:8], 16)  # Первые 8 символов hex
            meta_score = len(str(v.metadata)) if v.metadata else 0
            features.append([hash_val % 1000, meta_score])
        return np.array(features)
        
    def validate(self, vectors: List[VectorData]) -> Dict[str, Any]:
        """Проверка векторов на аномалии"""
        X = self._extract_features(vectors)
        
        # Если модель не обучена, обучаем на текущих данных (для демо)
        # В продакшене здесь была бы предобученная модель
        if not self.is_trained:
            self.model.fit(X)
            self.is_trained = True
            
        predictions = self.model.predict(X)
        
        # Анализ результатов
        anomalies = [v.name for v, p in zip(vectors, predictions) if p == -1]
        is_valid = len(anomalies) == 0
        
        result = {
            "is_valid": is_valid,
            "anomalies": anomalies,
            "score": float(np.mean(predictions)),  # -1 (аномалия) до 1 (норма)
            "message": "✅ All vectors passed ML validation" if is_valid 
                       else f"⚠️ Anomalies detected in: {', '.join(anomalies)}"        }
        
        print(result["message"])
        return result
