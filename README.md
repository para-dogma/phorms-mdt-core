# PhormS-MDT Core


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Tests](https://github.com/para-dogma/phorms-mdt-core/actions/workflows/test.yml/badge.svg)](https://github.com/para-dogma/phorms-mdt-core/actions)

[![Tact](https://img.shields.io/badge/Tact-v1.4+-purple.svg)](https://tact-lang.org/)

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Tests](https://img.shields.io/badge/Tests-27%2B%20passing-green.svg)](https://github.com/para-dogma/phorms-mdt-core/actions)

[![Tact](https://img.shields.io/badge/Tact-v1.4+-purple.svg)](https://tact-lang.org/)

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)

[![RWA](https://img.shields.io/badge/Category-RWA-orange.svg)](https://ton.org/)

**Core engine for Multidimensional Tokens (MDT) on TON.**  
A production-ready protocol for digitizing Real-World Assets (RWA) with built-in honesty enforcement.

## 🚀 Key Features

- **5-Vector Merkle Root System:** Identity, State, Quality, Legal, and Lineage vectors for complex asset representation.
- **Hard Split Logic:** Atomic token splitting with parent burning and strict amount conservation.
- **Time-Lock Consensus:** 30-day "honesty window" that automatically invalidates stale tokens.
- **ML-Powered Generator:** Python-based tool with anomaly detection to validate asset metrics before on-chain deployment.
- **Battle-Ready:** 27+ comprehensive tests covering edge cases, access control, and state transitions.

## 🏗️ Architecture

The MDT standard moves beyond simple fungible tokens by embedding five dimensions of truth directly into the smart contract:

| Vector | Purpose | Key Metrics |
| :--- | :--- | :--- |
| **Identity** | Ownership & Origin | Token ID, Owner, Minter, Timestamp |
| **State** | Operational Status | Active/Burned, Generation, Supply |
| **Quality** | Asset Validation | Score (0-100), Audit Status, Verifications |
| **Legal** | Compliance | Jurisdiction, Legal Status, Hash |
| **Lineage** | History | Depth, Split Count, Parent Tracking |

## 🛠️ Tech Stack

- **Smart Contracts:** Tact (v1.4+)
- **Generator & ML:** Python 3.10+, Pydantic, Scikit-Learn
- **Testing:** Jest, @ton/sandbox
- **License:** MIT

## ⚡ Quick Start

### 1. Build the Contract
```bash
npm install
npx tact --config tact.config.json
```

### 2. Generate a New Token
```bash
pip install pydantic numpy scikit-learn pandas
python scripts/phorms_generator.py
```

### 3. Run Tests
```bash
npm test
```

## 🤝 Contributing

PhormS-MDT is an open standard. We welcome contributions that improve security, gas efficiency, or RWA integration patterns.

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.
