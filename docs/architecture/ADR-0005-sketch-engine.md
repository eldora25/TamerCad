# ADR-0005 — Sketch Engine Architecture

- **Status:** Accepted
- **Date:** 2026-07-31
- **Version:** 0.1.0-alpha
- **Project:** TamerCAD

---

# 1. Purpose

This document defines the architecture of the Sketch Engine.

The Sketch Engine is responsible for creating, editing and managing
2D parametric sketches that serve as the foundation of all solid
modeling operations.

Every solid feature must originate from one or more sketches.

---

# 2. Problem Statement

A CAD sketch is more than a collection of lines.

Each sketch contains:

- Geometry
- Constraints
- Dimensions
- Construction entities
- Selection state
- Editing state

The engine must manage all of these while remaining responsive on
Android tablets.

---

# 3. Decision

The Sketch Engine shall be an independent subsystem.

It will never communicate directly with the Rendering Engine.

All communication must pass through the CAD Kernel.

---

# 4. Responsibilities

The Sketch Engine is responsible for:

- Creating sketches
- Editing sketches
- Deleting sketches
- Entity management
- Constraint registration
- Dimension registration
- Snapping
- Grid interaction
- Selection requests
- Geometry validation

The Sketch Engine does NOT perform rendering.

---

# 5. Supported Geometry

Phase 1

- Point
- Line
- Circle
- Arc
- Rectangle
- Polyline

Phase 2

- Ellipse
- Slot
- Polygon
- Bezier Curve
- Spline

Phase 3

- Text
- Imported Geometry
- Reference Geometry

---

# 6. Internal Architecture

```text
                Sketch Engine
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
Geometry       Constraints      Dimensions
     │               │               │
     └───────────────┼───────────────┘
                     ▼
              Validation Engine
                     │
                     ▼
               CAD Kernel API
```

---

# 7. Entity Hierarchy

```text
SketchEntity
│
├── Point
├── Line
├── Circle
├── Arc
├── Rectangle
├── Polyline
├── Ellipse
├── Spline
└── ConstructionGeometry
```

Every entity shall have a unique identifier.

---

# 8. Sketch Lifecycle

```text
Create Sketch
      │
      ▼
Add Geometry
      │
      ▼
Apply Constraints
      │
      ▼
Apply Dimensions
      │
      ▼
Validate Sketch
      │
      ▼
Ready For Modeling
```

---

# 9. Data Flow

```text
Stylus Input
      │
      ▼
Input Manager
      │
      ▼
Sketch Tool
      │
      ▼
Sketch Engine
      │
      ▼
Constraint Engine
      │
      ▼
Dimension Manager
      │
      ▼
CAD Kernel
      │
      ▼
Rendering Engine
```

---

# 10. Dependency Diagram

```text
UI
 │
 ▼
Tool System
 │
 ▼
Sketch Engine
 │
 ├──────────────┐
 ▼              ▼
Constraint   Dimension
     │          │
     └────┬─────┘
          ▼
     CAD Kernel
          │
          ▼
 Rendering Engine
```

Dependencies are one-way only.

---

# 11. Validation Rules

The Sketch Engine shall verify:

- Duplicate entities
- Zero-length lines
- Invalid arcs
- Invalid circles
- Broken references
- Invalid profiles
- Self-intersections (future)

Validation failures must never crash the application.

---

# 12. Performance Goals

- Smooth stylus interaction
- Incremental updates
- Low memory allocation
- Fast hit testing
- Efficient selection
- High frame rate

Target:

120 FPS on supported devices.

---

# 13. Future Features

Planned enhancements:

- Dynamic constraints
- Variables
- Expressions
- Blocks
- Reusable sketch templates
- Multi-sketch editing
- Layer support
- Collaboration-ready data model

---

# 14. Related ADRs

- ADR-0001 — Project Architecture
- ADR-0002 — Folder Structure
- ADR-0003 — CAD Engine Architecture
- ADR-0004 — Parametric Modeling

---

# 15. Affected Modules

- core/sketch
- core/kernel
- core/constraints
- core/history
- feature/sketch
- ui

---

# 16. Implementation Checklist

## Core

- [ ] Sketch base model
- [ ] Entity registry
- [ ] Entity ID generator
- [ ] Sketch serializer

## Geometry

- [ ] Point
- [ ] Line
- [ ] Circle
- [ ] Arc
- [ ] Rectangle
- [ ] Polyline

## Engine

- [ ] Sketch manager
- [ ] Validation engine
- [ ] Selection integration
- [ ] Grid integration

## Performance

- [ ] Incremental updates
- [ ] Spatial indexing
- [ ] Geometry cache

## Testing

- [ ] Unit tests
- [ ] Geometry validation tests
- [ ] Stress tests
- [ ] Stylus interaction tests

---

# 17. Decision Summary

The Sketch Engine is adopted as an independent subsystem responsible
for all sketch creation and editing.

Rendering, constraints and history remain separate concerns coordinated
by the CAD Kernel.

This architecture supports scalability, maintainability and future
feature expansion.

---

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT