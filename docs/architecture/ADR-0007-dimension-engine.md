# ADR-0007 — Dimension Engine Architecture

- **Document ID:** TCAD-ADR-0007
- **Status:** Accepted
- **Version:** 0.1.0-alpha
- **Date:** 2026-07-31
- **Last Updated:** 2026-07-31
- **Next Review Date:** 2027-01-31
- **Author:** Pardus26
- **Reviewer:** ChatGPT
- **Project:** TamerCAD

---

# 1. Purpose

This document defines the architecture of the Dimension Engine.

The Dimension Engine is responsible for creating, storing, editing and
evaluating dimensional information used by sketches and future
parametric features.

Dimensions are not visual annotations only.

Every editable dimension is part of the parametric model and therefore
MUST participate in model regeneration.

---

# 2. Scope

The Dimension Engine covers:

- Linear dimensions
- Angular dimensions
- Radial dimensions
- Diameter dimensions
- Offset dimensions
- Reference dimensions
- Driven dimensions
- Driving dimensions

Future versions MAY support:

- Equation-based dimensions
- Variables
- Expressions
- Spreadsheet links

---

# 3. Non-Goals

The Dimension Engine MUST NOT:

- Render graphics directly.
- Solve geometric constraints.
- Manage project history.
- Perform file import/export.
- Execute modeling operations.

Those responsibilities belong to other subsystems.

---

# 4. Definitions

**Driving Dimension**

A dimension that controls geometry.

**Driven Dimension**

A calculated value that reflects geometry but does not modify it.

**Reference Dimension**

Read-only measurement.

**Dimension Style**

Visual representation of dimensions.

---

# 5. Problem Statement

Professional CAD applications require editable dimensions.

Changing

100 mm

to

125 mm

should automatically regenerate dependent geometry.

Without a dedicated engine:

- dimensions become annotations only,
- geometry loses parametric behavior,
- future feature editing becomes difficult.

---

# 6. Decision

The Dimension Engine SHALL exist as an independent subsystem.

It SHALL communicate only through the CAD Kernel.

Rendering MUST remain outside the Dimension Engine.

Constraint solving MUST remain inside the Constraint Engine.

---

# 7. Responsibilities

The engine SHALL provide:

- Dimension creation
- Dimension editing
- Dimension deletion
- Validation
- Unit conversion
- Precision handling
- Formatting
- Dependency notification
- Serialization support

---

# 8. Supported Dimension Types

Phase 1

- Horizontal
- Vertical
- Linear
- Radius
- Diameter
- Angle

Phase 2

- Arc Length
- Chord Length
- Offset
- Ordinate

Phase 3

- Surface Distance
- Minimum Distance
- Maximum Distance
- Projected Distance

---

# 9. Internal Architecture

```text
                 Dimension Engine
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
 Dimension Registry  Unit Manager  Formatter
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                Validation Engine
                        │
                        ▼
                   CAD Kernel API
```

---

# 10. Data Flow

```text
Stylus
   │
Touch
   │
   ▼
Tool System
   │
   ▼
Dimension Tool
   │
   ▼
Dimension Engine
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

# 11. Module Dependencies

```text
Feature Layer
      │
      ▼
Sketch Engine
      │
      ▼
Dimension Engine
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

Dependencies MUST remain one-way.

Reverse dependencies are prohibited.

---

# 12. Dimension Lifecycle

```text
Create Dimension
        │
        ▼
Validate
        │
        ▼
Register
        │
        ▼
Notify CAD Kernel
        │
        ▼
Regenerate Geometry
        │
        ▼
Update Display
```

---

# 13. Data Model

```text
Dimension
│
├── id
├── name
├── type
├── value
├── unit
├── precision
├── style
├── driving
├── visible
├── locked
├── ownerEntity
├── createdAt
└── updatedAt
```

---

# 14. UML Overview

```text
+----------------------+
|  Dimension Engine    |
+----------+-----------+
           |
           v
+----------------------+
| Dimension Registry   |
+----------+-----------+
           |
           v
+----------------------+
| Validation Engine    |
+----------+-----------+
           |
           v
+----------------------+
|    CAD Kernel        |
+----------+-----------+
           |
           v
+----------------------+
|  Rendering Engine    |
+----------------------+
```

---

# 15. Performance Objectives

The Dimension Engine SHOULD:

- Avoid unnecessary allocations.
- Recalculate only affected dimensions.
- Support incremental updates.
- Cache formatted display values.
- Scale to thousands of dimensions.

Target:

- Update latency < 5 ms for a single dimension.
- Stable interaction at 120 FPS on supported devices.

---
# 16. Public API Impact

The Dimension Engine SHALL expose only a stable public API through the
CAD Kernel.

External modules MUST NOT directly modify dimension objects.

Example API responsibilities:

- Create Dimension
- Update Dimension
- Delete Dimension
- Query Dimensions
- Validate Dimension
- Notify Regeneration

Future implementations MAY provide asynchronous update pipelines.

---

# 17. Validation Rules

Every dimension SHALL be validated before registration.

Validation includes:

- Positive numeric value
- Valid unit
- Existing referenced geometry
- Supported dimension type
- Valid ownership
- Precision limits

The engine MUST reject invalid dimensions without modifying the model.

---

# 18. Unit System

Supported units (Phase 1)

- Millimeter (default)
- Centimeter
- Meter
- Inch

Future units

- Foot
- Micrometer
- Custom project units

Internal calculations SHOULD use millimeters to reduce conversion
complexity.

---

# 19. Precision Policy

Displayed precision SHALL be configurable.

Examples

0

0.0

0.00

0.000

Internal calculations MUST use full floating-point precision.

Formatting SHALL NOT modify stored values.

---

# 20. Serialization

Dimensions MUST support serialization.

Serialized data SHALL include:

```text
Dimension
│
├── id
├── ownerId
├── type
├── value
├── unit
├── precision
├── driving
├── visible
├── locked
└── metadata
```

Future project files SHALL store dimensions inside the `.tcad`
document format.

---

# 21. Error Handling

The engine SHALL detect:

- Missing entities
- Invalid values
- Broken references
- Unsupported units
- Serialization failures

Errors MUST be reported through the CAD Kernel.

The Dimension Engine MUST NEVER terminate the application because of
invalid dimension data.

---

# 22. Security Considerations

The engine SHALL verify imported dimension data.

Corrupted project files MUST NOT compromise application stability.

Future encrypted project files SHALL preserve dimension integrity.

---

# 23. Risks

Potential risks include:

- Dependency cycles
- Precision loss
- Large sketch performance degradation
- Invalid imported data
- Excessive regeneration

Mitigation strategies:

- Incremental updates
- Dependency graph validation
- Cached formatting
- Input validation
- Extensive testing

---

# 24. Future Extensions

Planned features include:

- Named variables
- Mathematical expressions
- Formula editor
- Configuration tables
- Spreadsheet integration
- Global parameters
- Linked dimensions
- Design tables

---

# 25. Related ADRs

- ADR-0001 — Project Architecture
- ADR-0002 — Folder Structure
- ADR-0003 — CAD Engine Architecture
- ADR-0004 — Parametric Modeling
- ADR-0005 — Sketch Engine
- ADR-0006 — Constraint Engine

---

# 26. Affected Modules

```text
core/dimensions
core/kernel
core/sketch
core/history
core/project
feature/sketch
feature/modeling
ui
```

---

# 27. Implementation Checklist

## Core

- [ ] Dimension model
- [ ] Dimension registry
- [ ] Unit manager
- [ ] Precision formatter

## Engine

- [ ] Validation engine
- [ ] Serialization
- [ ] Dependency notification
- [ ] Incremental updates

## User Interface

- [ ] Dimension tool
- [ ] Dimension editor
- [ ] Unit selector
- [ ] Precision settings

## Performance

- [ ] Cached formatting
- [ ] Lazy updates
- [ ] Incremental regeneration

## Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] Serialization tests
- [ ] Performance benchmarks
- [ ] Stress tests

---

# 28. Open Questions

- [ ] Should variables support mathematical expressions?
- [ ] Should dimensions support external references?
- [ ] Should projects allow multiple unit systems simultaneously?
- [ ] Should locked dimensions be editable through formulas?
- [ ] Should dimension styles be customizable per project?

These questions SHALL be reviewed before Phase 2 implementation.

---

# 29. Revision History

| Version | Date | Description |
|----------|------------|------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 30. Decision Summary

The Dimension Engine is adopted as an independent subsystem responsible
for all dimensional information within TamerCAD.

It SHALL communicate exclusively through the CAD Kernel.

Rendering, constraint solving and history management remain isolated
responsibilities.

This architecture supports scalability, maintainability, predictable
performance and future parametric extensions.

---

# 31. Approval

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT

Approval Date

2026-07-31

Document Status

Accepted
# End of Part 1

Continue with:

ADR-0007 Part 2

Sections:

16. Public API
17. Validation Rules
18. Security Considerations
19. Risks
20. Future Extensions
21. Related ADRs
22. Affected Modules
23. Implementation Checklist
24. Open Questions
25. Revision History
26. Decision Summary
27. Approval