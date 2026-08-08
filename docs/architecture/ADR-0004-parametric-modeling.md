# ADR-0004 — Parametric Modeling Architecture

- **Status:** Accepted
- **Date:** 2026-07-31
- **Version:** 0.1.0-alpha
- **Project:** TamerCAD

---

# 1. Purpose

This document defines the architecture of the parametric modeling system used by TamerCAD.

The objective is to create a modeling workflow where every operation is represented by editable parameters instead of destructive geometry modifications.

The architecture must support future extensions such as assemblies, design history, and advanced constraints.

---

# 2. Problem Statement

Traditional direct modeling modifies geometry immediately.

While this approach is simple, it makes later edits difficult.

A professional CAD application requires editable operations.

Examples:

- Change extrusion distance
- Modify sketch dimensions
- Replace fillet radius
- Reorder modeling operations

Therefore TamerCAD shall adopt a parametric modeling architecture.

---

# 3. Decision

Every modeling operation will create a Feature object.

Geometry is generated from the Feature list instead of storing only the final mesh.

---

# 4. Core Concepts

Each feature contains:

- Unique Identifier
- Feature Type
- Parameters
- Dependencies
- Creation Time
- Last Modification Time
- Visibility
- Suppression State

---

# 5. Feature Tree

```text
Project
│
├── Sketch 001
│
├── Extrude 001
│
├── Fillet 001
│
├── Sketch 002
│
├── Revolve 001
│
└── Chamfer 001
```

Every feature is editable.

---

# 6. Modeling Pipeline

```text
Sketch
   │
   ▼
Constraints
   │
   ▼
Profile Validation
   │
   ▼
Feature Creation
   │
   ▼
History Engine
   │
   ▼
CAD Kernel
   │
   ▼
Solid Generation
   │
   ▼
Rendering Engine
```

---

# 7. Feature Dependencies

```text
Sketch
   │
   ▼
Extrude
   │
   ▼
Fillet
   │
   ▼
Chamfer
```

If Sketch changes:

- Extrude updates
- Fillet updates
- Chamfer updates

automatically.

---

# 8. Feature Data Structure

```text
Feature

├── id
├── name
├── type
├── parameters
├── parents
├── children
├── enabled
├── visible
├── timestamp
└── metadata
```

---

# 9. Feature Types

Initial feature list:

- Sketch
- Extrude
- Revolve
- Sweep
- Loft
- Fillet
- Chamfer
- Mirror
- Pattern
- Shell
- Boolean Union
- Boolean Difference
- Boolean Intersection

Future features may be added without changing the existing architecture.

---

# 10. Update Flow

```text
Parameter Changed
        │
        ▼
Feature Updated
        │
        ▼
Dependency Graph
        │
        ▼
Affected Features
        │
        ▼
CAD Kernel
        │
        ▼
Rendering Engine
```

Only affected features should be recalculated.

---

# 11. Dependency Graph

```text
Sketch A
    │
    ▼
Extrude
    │
    ├───────────┐
    ▼           ▼
Fillet      Mirror
    │           │
    └─────┬─────┘
          ▼
      Final Model
```

Circular dependencies are not allowed.

---

# 12. Performance Goals

- Incremental rebuilds
- Minimal memory allocation
- Efficient dependency traversal
- Lazy regeneration
- Cached intermediate results

---

# 13. Error Handling

The engine shall detect:

- Missing references
- Invalid profiles
- Circular dependencies
- Failed feature regeneration

Errors must not corrupt the project state.

---

# 14. Future Extensions

Planned capabilities:

- Feature folders
- Feature groups
- Configurations
- Design variants
- Suppressed features
- Expressions
- Variables
- Equations

---

# 15. Decision Summary

TamerCAD adopts a fully parametric feature-based modeling architecture.

Every modeling action becomes an editable feature stored in the project history.

The model is regenerated from the feature tree rather than permanently modifying geometry.

---

# 16. Implementation Checklist

## Core

- [ ] Feature base class
- [ ] Feature ID system
- [ ] Feature registry
- [ ] Feature serialization

## Kernel

- [ ] Dependency graph
- [ ] Regeneration engine
- [ ] Update manager

## Modeling

- [ ] Sketch feature
- [ ] Extrude feature
- [ ] Revolve feature
- [ ] Fillet feature
- [ ] Chamfer feature

## Performance

- [ ] Incremental rebuild
- [ ] Cache manager
- [ ] Lazy evaluation

## Testing

- [ ] Unit tests
- [ ] Dependency tests
- [ ] Performance benchmarks
- [ ] Stress tests

---

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT