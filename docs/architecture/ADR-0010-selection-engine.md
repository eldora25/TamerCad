# ADR-0010 — Selection Engine Architecture

## 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0010 |
| Document Type | Architecture Decision Record |
| Title | Selection Engine Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Last Updated | 2026-07-31 |
| Next Review | 2027-01-31 |
| Project | TamerCAD |
| Module | Selection Engine |
| Related Documents | ADR-0003, ADR-0005, ADR-0008, ADR-0009 |

---

# 2. Purpose

This ADR defines the architecture of the Selection Engine.

The Selection Engine SHALL be responsible for identifying, tracking,
modifying and exposing user selections across the entire CAD system.

Selection MUST be deterministic, fast and independent from rendering.

---

# 3. Scope

The Selection Engine SHALL support:

- Single selection
- Multi-selection
- Box selection
- Crossing selection
- Lasso selection (future)
- Paint selection (future)
- Selection filters
- Hover detection
- Pre-selection highlighting
- Selection persistence

---

# 4. Non-Goals

The Selection Engine MUST NOT:

- Render objects
- Modify geometry
- Solve constraints
- Execute modeling features
- Store project history

---

# 5. Definitions

**Selection**

A collection of entities currently chosen by the user.

**Pre-selection**

Temporary hover feedback before selection.

**Hit Test**

Process of determining which entity is under the pointer.

**Selection Filter**

Rule restricting selectable entity types.

---

# 6. Problem Statement

Professional CAD applications require precise and predictable selection.

Large models may contain millions of selectable entities.

Without an isolated Selection Engine:

- Hit testing becomes inconsistent.
- Tools duplicate selection logic.
- Performance degrades.
- User experience suffers.

---

# 7. Decision

A dedicated Selection Engine SHALL manage all user selections.

All tools MUST communicate with the Selection Engine through the CAD
Kernel.

Rendering SHALL consume immutable selection state.

---

# 8. Alternatives Considered

## Alternative A — Rendering-driven Selection

Pros

- Simple implementation

Cons

- Tight coupling
- Poor scalability
- Difficult testing

---

## Alternative B — Tool-local Selection

Pros

- Minimal infrastructure

Cons

- Duplicate logic
- Inconsistent behavior
- Hard maintenance

---

## Chosen Solution

Independent Selection Engine.

---

# 9. Rationale

Separating selection from rendering and modeling:

- Improves maintainability.
- Enables consistent behavior.
- Simplifies testing.
- Supports future collaboration.
- Allows backend-independent rendering.

---

# 10. High-Level Architecture

```text
                 Selection Engine
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
 Hit Test        Selection State    Filters
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                   CAD Kernel
```

---

# 11. Data Flow

```text
Stylus / Mouse
       │
       ▼
Input Manager
       │
       ▼
Selection Tool
       │
       ▼
Selection Engine
       │
       ▼
CAD Kernel
       │
       ▼
Rendering Engine
```

---

# 12. Module Dependencies

```text
Input Layer
      │
      ▼
Selection Engine
      │
      ▼
CAD Kernel
      │
      ▼
Rendering Engine
```

Dependencies MUST remain acyclic.

---

# 13. Internal Components

```text
Selection Engine

├── Selection Manager
├── Hit Test Engine
├── Filter Manager
├── Hover Manager
├── Selection Cache
├── Spatial Index Adapter
└── Event Dispatcher
```

---

# 14. Selection Lifecycle

```text
Pointer Event
      │
      ▼
Hit Test
      │
      ▼
Apply Filter
      │
      ▼
Update Selection
      │
      ▼
Notify CAD Kernel
      │
      ▼
Render Highlight
```

---

# 15. Selection Modes

Supported modes:

- Replace
- Add
- Remove
- Toggle
- Window Selection
- Crossing Selection

Future modes:

- Lasso
- Paint Brush
- Smart Selection
- Topological Selection

---

# 16. Spatial Query Pipeline

```text
Pointer
   │
   ▼
Viewport Coordinates
   │
   ▼
Spatial Index
   │
   ▼
Candidate Entities
   │
   ▼
Precision Hit Test
   │
   ▼
Selection Result
```

---

# 17. Performance Targets

The Selection Engine SHOULD:

- Select within 5 ms.
- Scale to millions of entities.
- Minimize memory allocations.
- Use spatial acceleration.
- Avoid full-scene scans whenever possible.

Target:

- Hit Test latency < 3 ms
- Selection update latency < 5 ms

---

# End of Part 1

Continue with:

ADR-0010 Part 2

Sections:

18. Public API
19. Selection Filters
20. Event Model
21. Persistence
22. Security Considerations
23. Risks
24. Future Work
25. Related ADRs
26. Affected Modules
27. Implementation Checklist
28. Acceptance Criteria
29. Quality Attributes
30. Open Questions
31. Revision History
32. Decision Summary
33. Approval
# 18. Public API

The Selection Engine SHALL expose its functionality exclusively
through the CAD Kernel.

Direct manipulation of the internal selection state by external
modules MUST NOT be permitted.

Minimum public API:

- Select Entity
- Deselect Entity
- Toggle Selection
- Clear Selection
- Select All
- Invert Selection
- Query Selection
- Set Selection Filter
- Get Hover Entity
- Begin Selection Transaction
- End Selection Transaction

The public API SHOULD remain backend-independent.

---

# 19. Selection Filters

Selection filters SHALL restrict selectable entity types.

Supported filters (Phase 1):

- Any
- Sketch Geometry
- Solids
- Faces
- Edges
- Vertices
- Dimensions
- Construction Geometry

Future filters MAY include:

- Hidden Objects
- Locked Objects
- Feature Type
- Material
- User-defined Filters

Filter pipeline:

```text
Pointer Event
      │
      ▼
Candidate Entities
      │
      ▼
Selection Filter
      │
      ▼
Filtered Result
```

---

# 20. Event Model

The Selection Engine SHALL publish immutable events.

```text
SelectionChanged

├── Previous Selection
├── Current Selection
├── Timestamp
├── Source Tool
└── Selection Mode
```

Subscribers MAY include:

- Rendering Engine
- Property Panel
- History Engine
- Tool Manager
- Inspector Panel

---

# 21. Persistence

Selection state is considered transient.

The current selection MUST NOT be stored in project files.

Future collaborative sessions MAY synchronize shared selections.

Selection preferences SHALL be stored separately from project data.

---

# 22. Security Considerations

The Selection Engine SHALL validate all incoming entity identifiers.

Invalid references MUST be ignored gracefully.

Selection requests originating from future plugins SHALL be validated
by the CAD Kernel before execution.

The engine SHALL never expose internal mutable collections.

---

# 23. Risks

Potential risks include:

- Expensive hit testing
- Duplicate selections
- Invalid entity references
- Large model performance degradation
- Race conditions during future collaborative editing

Mitigation strategies:

- Spatial indexing
- Immutable selection snapshots
- Cached hit-test results
- Selection validation
- Thread-safe event dispatching

---

# 24. Future Work

Planned enhancements:

- Lasso selection
- Paint selection
- Smart feature selection
- Topological propagation
- Similar object selection
- Rule-based filters
- Selection sets
- Named selections
- Collaborative selections
- XR controller support

---

# 25. Related ADRs

- ADR-0001 — Project Architecture
- ADR-0003 — CAD Engine Architecture
- ADR-0005 — Sketch Engine
- ADR-0008 — Rendering Engine
- ADR-0009 — History Engine

---

# 26. Affected Modules

```text
core/selection
core/kernel
core/input
core/rendering
feature/sketch
feature/modeling
ui
```

---

# 27. Implementation Checklist

## Core

- [ ] SelectionManager
- [ ] SelectionRepository
- [ ] HitTestEngine
- [ ] HoverManager
- [ ] FilterManager

## API

- [ ] Public Selection API
- [ ] Immutable selection snapshots
- [ ] Event dispatcher
- [ ] Selection observers

## Performance

- [ ] Spatial index integration
- [ ] Incremental updates
- [ ] Cached hit tests
- [ ] Dirty-region optimization

## User Interface

- [ ] Selection overlay
- [ ] Hover highlighting
- [ ] Multi-selection gestures
- [ ] Selection filters

## Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] Stress tests
- [ ] Performance benchmarks
- [ ] Large-model selection tests

---

# 28. Acceptance Criteria

- [ ] Selection behavior is deterministic.
- [ ] Public API is documented.
- [ ] Multi-selection is supported.
- [ ] Selection filters operate correctly.
- [ ] No circular dependencies exist.
- [ ] Performance targets are met.
- [ ] Automated tests pass.

---

# 29. Quality Attributes

| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Performance | 5 | Spatial indexing and cached hit testing |
| Scalability | 5 | Designed for large CAD models |
| Maintainability | 5 | Independent subsystem |
| Testability | 5 | Deterministic event model |
| Reliability | 5 | Immutable state and validation |
| Extensibility | 5 | Filter and tool extensions supported |
| Security | 4 | Input validation and encapsulation |

---

# 30. Open Questions

- [ ] Should named selection sets be saved in project files?
- [ ] Should hidden objects be selectable through an override mode?
- [ ] Should selections support user-defined metadata?
- [ ] How should collaborative selection conflicts be visualized?
- [ ] Should AI-assisted semantic selection be introduced in a future release?

These questions SHALL be reviewed before Phase 2 implementation.

---

# 31. Revision History

| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 32. Decision Summary

The Selection Engine is adopted as an independent subsystem responsible
for all entity selection operations within TamerCAD.

Selection SHALL be deterministic, backend-independent and mediated
through the CAD Kernel.

This architecture provides a scalable foundation for advanced
selection workflows, collaborative editing and future intelligent
selection capabilities.

---

# 33. Approval

Approved By

Project Founder

Pardus26

Architecture Assistant

ChatGPT

Approval Date

2026-07-31

Document Status

Accepted