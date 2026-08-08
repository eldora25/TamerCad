# ADR-0006 — Constraint Engine Architecture

- **Document ID:** TCAD-ADR-0006
- **Status:** Accepted
- **Date:** 2026-07-31
- **Last Updated:** 2026-07-31
- **Next Review Date:** 2027-01-31
- **Version:** 0.1.0-alpha
- **Author:** Pardus26
- **Reviewer:** ChatGPT
- **Project:** TamerCAD

---

# 1. Purpose

This document defines the architecture of the Constraint Engine.

The Constraint Engine maintains geometric relationships between sketch entities.

It guarantees that sketches remain mathematically consistent while users edit geometry.

---

# 2. Problem Statement

Sketches are not only collections of geometric entities.

Professional CAD systems require persistent relationships such as:

- Horizontal
- Vertical
- Parallel
- Perpendicular
- Tangent
- Coincident
- Equal
- Symmetry
- Midpoint
- Concentric

Without a dedicated constraint subsystem, geometry becomes unstable and difficult to edit.

---

# 3. Decision

Constraint solving shall be isolated into its own engine.

The engine will never render graphics.

Its responsibility is to solve relationships and return updated geometry to the CAD Kernel.

---

# 4. Responsibilities

The Constraint Engine is responsible for:

- Registering constraints
- Updating constraints
- Removing constraints
- Detecting conflicts
- Solving dependency chains
- Reporting unsatisfied constraints
- Maintaining sketch stability

---

# 5. Supported Constraints

Phase 1

- Coincident
- Horizontal
- Vertical
- Parallel
- Perpendicular

Phase 2

- Tangent
- Equal
- Concentric
- Midpoint
- Fixed

Phase 3

- Symmetry
- Offset
- Curvature
- Pattern references

---

# 6. Engine Architecture

```text
          Constraint Engine
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
 Constraint   Dependency   Solver
 Registry       Graph      Core
      │           │           │
      └───────────┼───────────┘
                  ▼
             CAD Kernel API
```

---

# 7. Solver Workflow

```text
User Edit
    │
    ▼
Sketch Engine
    │
    ▼
Constraint Registry
    │
    ▼
Dependency Graph
    │
    ▼
Constraint Solver
    │
    ▼
Updated Geometry
    │
    ▼
CAD Kernel
```

---

# 8. Dependency Rules

```text
Point A
   │
   ▼
Horizontal Constraint
   │
   ▼
Line AB
   │
   ▼
Parallel Constraint
   │
   ▼
Line CD
```

Constraint propagation shall always follow a directed dependency graph.

Circular dependency detection is mandatory.

---

# 9. Conflict Detection

The engine shall detect:

- Over-constrained sketches
- Under-constrained sketches
- Circular references
- Invalid references
- Impossible geometry

The user shall receive clear diagnostic information.

---

# 10. Performance Goals

- Incremental solving
- Fast constraint updates
- Minimal recalculation
- Stable numerical behavior
- Low memory footprint

Target latency:

- Single constraint update: under 5 ms on supported hardware.

---

# 11. Future Enhancements

Planned capabilities:

- Variable-driven constraints
- Formula-based dimensions
- Constraint groups
- Constraint suppression
- External references
- Assembly constraints

---

# 12. Data Flow

```text
Stylus Input
      │
      ▼
Sketch Engine
      │
      ▼
Constraint Registry
      │
      ▼
Dependency Graph
      │
      ▼
Constraint Solver
      │
      ▼
CAD Kernel
      │
      ▼
Rendering Engine
```

---

# 13. Module Dependencies

```text
Feature Layer
      │
      ▼
Sketch Engine
      │
      ▼
Constraint Engine
      │
      ▼
CAD Kernel
      │
      ▼
History Engine
      │
      ▼
Rendering Engine
```

---

# 14. Related ADRs

- ADR-0001 — Project Architecture
- ADR-0002 — Folder Structure
- ADR-0003 — CAD Engine Architecture
- ADR-0004 — Parametric Modeling
- ADR-0005 — Sketch Engine

---

# 15. Affected Modules

- core/constraints
- core/sketch
- core/kernel
- core/history
- feature/sketch
- ui

---

# 16. Implementation Checklist

## Core

- [ ] Constraint base interface
- [ ] Constraint registry
- [ ] Constraint serializer
- [ ] Constraint identifier system

## Solver

- [ ] Dependency graph
- [ ] Conflict detection
- [ ] Incremental solver
- [ ] Circular dependency detection

## Constraint Types

- [ ] Coincident
- [ ] Horizontal
- [ ] Vertical
- [ ] Parallel
- [ ] Perpendicular
- [ ] Tangent
- [ ] Equal
- [ ] Concentric

## Testing

- [ ] Unit tests
- [ ] Stress tests
- [ ] Performance benchmarks
- [ ] Numerical stability tests

---

# 17. Revision History

| Version | Date | Description |
|----------|------------|------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 18. Decision Summary

The Constraint Engine is adopted as an independent subsystem responsible for maintaining all geometric relationships.

It communicates only through the CAD Kernel and remains isolated from rendering logic.

This architecture supports long-term scalability, extensibility and high-performance constraint solving.

---

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT