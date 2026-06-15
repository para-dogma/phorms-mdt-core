# 🏗️ PhormS-MDT Interactive Architecture

> This diagram is auto-generated from code structure. 
> **Green** = Completed, **Yellow** = In Progress, **Gray** = Planned.

```mermaid
graph TD
    %% Styles
    classDef done fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:white;
    classDef progress fill:#f1c40f,stroke:#f39c12,stroke-width:2px,color:black;
    classDef planned fill:#95a5a6,stroke:#7f8c8d,stroke-width:2px,color:white;
    classDef core fill:#3498db,stroke:#2980b9,stroke-width:4px,color:white;

    subgraph "Core Engine (Tact)"
        A[Smart Contract Core]:::core -->|5 Vectors| B(Identity & State)
        A -->|Logic| C(Hard Split & Time-Lock)
        A -->|Compliance| D(Legal & Lineage)
    end

    subgraph "Generator Layer (Python)"
        E[MDT Generator]:::progress -->|Pydantic Config| F(ML Anomaly Detector)
        F -->|Validates| G(Tact Code Output)
    end

    subgraph "Infrastructure"
        H[GitHub Repo]:::done -->|Auto-Status| I(validate.sh)
        I -->|Updates| J(PROJECT_STATUS.md)
        K[Tonkeeper Testnet]:::planned -->|Deploy| A
    end

    %% Connections
    G -->|Bytecode| K
    E -->|Config| A
    
    %% Current Stage Highlight
    style A fill:#3498db,stroke:#fff,stroke-width:4px
    style K fill:#f1c40f,stroke:#fff,stroke-width:2px
```

## 🗺️ Development Roadmap

| Phase | Component | Status | Description |
| :--- | :--- | :--- | :--- |
| 1 | Core Contract | ✅ Done | Tact v1.4, 5-vector logic |
| 2 | Automation | ✅ Done | Health checks, auto-status |
| 3 | Deployment | 🔄 Active | Testnet upload via Tonkeeper |
| 4 | Frontend | ⏳ Planned | React dashboard for RWA |
