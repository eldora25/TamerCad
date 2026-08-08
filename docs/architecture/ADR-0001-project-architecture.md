# ADR-0001 — TamerCAD Project Architecture

- **Status:** Accepted
- **Date:** 2026-07-31
- **Version:** 0.1.0-alpha
- **Project:** TamerCAD

---

# 1. Purpose

This document defines the architectural principles of the TamerCAD project.

The objective is to build a modern, professional, tablet-first CAD application for Android inspired by the workflow of Shapr3D while remaining an original implementation.

The architecture must remain scalable for many years without requiring major rewrites.

---

# 2. Core Principles

The project follows these principles:

- Clean Architecture
- SOLID Principles
- MVVM
- Modular Design
- Single Responsibility Principle
- Testability
- Maintainability
- High Performance
- Offline First
- Tablet First
- Stylus First

---

# 3. Programming Language

Primary Language:

- Kotlin

Secondary Language (Future):

- C++ (NDK)

Reason:

Advanced geometry calculations, CAD kernel integration and performance-critical operations.

---

# 4. Target Platform

Primary

- Android Tablets

Secondary

- Android Phones

Future

- Windows
- Linux
- macOS

---

# 5. Minimum Android Version

Android 10 (API 29)

Reason:

Modern graphics APIs,
better stylus support,
large screen compatibility.

---

# 6. UI Framework

Jetpack Compose

Reason

- Modern
- Reactive
- Faster development
- Easier maintenance

---

# 7. Dependency Injection

Hilt

Reason

Provides scalable dependency management.

---

# 8. Navigation

Navigation Compose

---

# 9. Local Database

Room Database

Purpose

- Project list
- Settings
- Recent files
- Future plugin data

---

# 10. Rendering Engine

Current

Jetpack Compose Canvas

Future

OpenGL ES

Later

Vulkan

---

# 11. CAD Kernel

Phase 1

Custom Geometry Engine

Phase 2

Constraint Solver

Phase 3

Parametric Modeling Engine

Phase 4

Solid Modeling

Phase 5

Assembly Engine

---

# 12. Supported File Formats

Phase 1

TamerCAD Project (.tcad)

Phase 2

STL

Phase 3

STEP

Phase 4

DXF

Phase 5

IGES

---

# 13. Folder Structure

app/
core/
domain/
data/
feature/
ui/
docs/
gradle/

---

# 14. Code Style

- English only
- KDoc required
- No duplicated code
- Maximum readability
- Small classes
- Single responsibility

---

# 15. Versioning

Semantic Versioning

Example

0.1.0-alpha

---

# 16. Branch Strategy

main

Stable releases

develop

Development branch

feature/*

Feature branches

---

# 17. Testing

Unit Tests

UI Tests

Benchmark Tests

---

# 18. Long-Term Vision

TamerCAD will become a professional Android CAD platform optimized for stylus input.

The project will prioritize maintainability, performance, modularity, and usability over rapid feature growth.

Every architectural decision should support long-term sustainability.

---

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT