---
name: Lightweight ML Mode
about: Reduce dependencies for faster validation
title: 'enhancement: Add lightweight ML mode without sklearn'
labels: enhancement, good first issue
---

## Problem
Current `phorms_generator.py` requires `scikit-learn`, `pandas`, and `numpy` (>300MB). For simple scalar quality scores (0-100), this is overkill.

## Solution
Add a `--lightweight` flag to the generator that uses pure Python or minimal numpy for basic anomaly detection (e.g., Z-score).

## Benefits
- Faster CI/CD
- Easier deployment on edge devices
- Lower barrier for contributors
