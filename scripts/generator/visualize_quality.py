import matplotlib.pyplot as plt
import numpy as np
from .mdt_generator import MDTGenerator

def plot_vector_health():
    gen = MDTGenerator()
    
    # Генерируем токен и собираем метрики
    token = gen.generate_token()
    
    # Данные для графика (длины хешей как прокси качества)
    names = [v.name for v in token.vectors]
    scores = [len(v.value) for v in token.vectors]
    
    # Рисуем Radar Chart (Паутинка)
    angles = np.linspace(0, 2 * np.pi, len(names), endpoint=False).tolist()
    scores += scores[:1]
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.plot(angles, scores, color='blue', linewidth=2, linestyle='solid')
    ax.fill(angles, scores, color='blue', alpha=0.25)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(names, fontsize=12)
    ax.set_title("MDT Vector Health Check", va='bottom', fontsize=15)
    
    plt.savefig('vector_health.png')
    print("✅ Visualization saved to vector_health.png")
    plt.show()

if __name__ == "__main__":
    plot_vector_health()
