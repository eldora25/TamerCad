# ADR-0015 — Feature System Architecture


# 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0015 |
| Document Type | Architecture Decision Record |
| Title | Feature System Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Project | TamerCAD |
| Module | Feature System |
| Related Documents | ADR-0003, ADR-0004, ADR-0009, ADR-0013, ADR-0014 |


---

# 2. Purpose

This ADR defines the architecture of the TamerCAD Feature System.

The Feature System SHALL provide the foundation for parametric CAD
modeling.

The system SHALL manage:

- Parametric operations
- Feature dependencies
- Model regeneration
- Feature history
- Feature editing
- Feature suppression


---

# 3. Scope

The Feature System SHALL define:

- Feature lifecycle
- Feature data model
- Feature tree
- Dependency graph
- Regeneration engine
- Feature parameters
- Feature validation
- Feature states


---

# 4. Non-Goals

The Feature System MUST NOT:

- Perform low-level geometry calculations
- Handle rendering
- Manage user input
- Store project files directly

These responsibilities belong to:

```
Geometry Kernel
Rendering Engine
Input System
Project Storage
```

---

# 5. Definition

A Feature is a parametric operation that transforms
one model state into another.

Example:

```
Sketch

   │

   ▼

Extrude Feature

   │

   ▼

Solid Body
```


---

# 6. Problem Statement

Modern CAD systems are not based on static geometry.

A professional CAD model requires:

- Editable history
- Parameter changes
- Automatic regeneration
- Dependency tracking

Without a Feature System:

- Models become static.
- Editing becomes destructive.
- Design intent is lost.


---

# 7. Decision

TamerCAD SHALL use a feature-based parametric modeling architecture.

Every modeling operation SHALL be represented as a Feature.


Example:

```
Feature Tree


Sketch001

    │

    ▼

Extrude001

    │

    ▼

Fillet001

    │

    ▼

Hole001
```


---

# 8. Feature Architecture Overview


```
                    Feature System


                         │


        ┌────────────────┼────────────────┐


        ▼                ▼                ▼


 Feature Tree     Dependency Graph   Regeneration


        │                │                │


        └────────────────┼────────────────┘


                         ▼


                Geometry Kernel
```


---

# 9. Feature System Components


```
Feature System


├── Feature Base Class
│
├── Feature Manager
│
├── Feature Tree
│
├── Dependency Graph
│
├── Parameter System
│
├── Regeneration Engine
│
├── Validation System
│
└── Feature Registry
```


---

# 10. Feature Lifecycle


Every feature SHALL follow:


```
Created

  │

  ▼

Configured

  │

  ▼

Validated

  │

  ▼

Computed

  │

  ▼

Committed

  │

  ▼

Displayed
```


---

# 11. Feature States


A feature SHALL have states:


```
Feature State


├── Created
│
├── Active
│
├── Suppressed
│
├── Failed
│
├── Outdated
│
└── Deleted
```


---

# 12. Feature Data Model


Every feature SHALL contain:


```
Feature


├── Feature ID
├── Feature Type
├── Parameters
├── Inputs
├── Outputs
├── Dependencies
├── State
├── Version
└── Metadata
```


---

# 13. Feature Example


Example:

```
Extrude Feature


Input:

Sketch001


Parameters:

Length = 50mm


Output:

Solid Body
```


---

# 14. Feature Tree Architecture


The Feature Tree SHALL represent modeling history.


```
Document


└── Part


     ├── Sketch001

     ├── Extrude001

     ├── Fillet001

     └── Hole001
```


---

# 15. Feature Tree Rules


The Feature Tree SHALL:

- Preserve creation order.
- Maintain dependencies.
- Support rollback.
- Support editing.
- Support suppression.


---

# 16. Feature Tree Data Flow


```
User Action

     │

     ▼

Command System

     │

     ▼

Create Feature

     │

     ▼

Feature Tree

     │

     ▼

Regeneration Engine

     │

     ▼

Geometry Kernel
```


---

# End of Part 1 / 4


Next:

ADR-0015 Part 2 / 4

Sections:

17. Dependency Graph
18. Parametric Relationships
19. Regeneration Engine
20. Feature Evaluation
21. Rollback System
22. Suppression System
# 17. Dependency Graph

The Feature System SHALL maintain a dependency graph to describe
relationships between features.

A feature MUST know:

- Which features provide its inputs.
- Which features depend on its output.
- When regeneration is required.

---

# 18. Dependency Graph Architecture

```text
                 Feature Graph


                 Sketch001

                     │

                     ▼

                Extrude001

                     │

                     ▼

                 Fillet001

                     │

                     ▼

                  Hole001
```

The graph represents the design intent of the model.

---

# 19. Dependency Types

The system SHALL support:

```text
Dependencies

├── Geometry Dependency
│
├── Parameter Dependency
│
├── Reference Dependency
│
└── Feature Dependency
```

---

# 20. Dependency Rules

A feature:

- MAY depend on multiple previous features.
- MUST NOT create circular dependencies.
- MUST track dependency changes.
- MUST invalidate dependent features when required.

---

# 21. Dependency Validation

Before regeneration:

```text
Feature Change

       │

       ▼

Analyze Dependencies

       │

       ▼

Find Affected Features

       │

       ▼

Regenerate Chain
```

---

# 22. Parametric Relationships

The Feature System SHALL support parametric relationships.

Parameters SHALL drive feature behavior.

Example:

```
Box Feature

Length = 100 mm

Width  = 50 mm

Height = 20 mm
```

Changing:

```
Height

20 mm

   ↓

40 mm
```

updates the resulting geometry.

---

# 23. Parameter System Architecture

```text
Parameter System


├── Parameter Definition
│
├── Parameter Value
│
├── Unit System
│
├── Expression Engine
│
└── Dependency Resolver
```

---

# 24. Parameter Types

Supported parameters:

```text
Parameters

├── Length
├── Angle
├── Distance
├── Boolean
├── Integer
├── String
└── Expression
```

---

# 25. Expression Support

Parameters MAY contain formulas.

Example:

```
Width = Length / 2
```

Dependency:

```
Length

  │

  ▼

Width
```

---

# 26. Unit Management

The Feature System SHALL support unit-aware parameters.

Example:

```
10 mm

=

1 cm

=

0.01 m
```

Internal calculations SHALL use a consistent unit system.

---

# 27. Regeneration Engine

The Regeneration Engine SHALL rebuild the model after changes.

Responsibilities:

- Detect changes.
- Calculate affected features.
- Recompute outputs.
- Update dependencies.

---

# 28. Regeneration Architecture

```text
Parameter Change

        │

        ▼

Dependency Analyzer

        │

        ▼

Feature Scheduler

        │

        ▼

Feature Evaluation

        │

        ▼

Geometry Kernel

        │

        ▼

Updated Model
```

---

# 29. Feature Evaluation

Each feature SHALL implement an evaluation method.

Example:

```
Feature

Evaluate()

      │

      ▼

Generate Geometry

      │

      ▼

Return Result
```

---

# 30. Evaluation Order

Features SHALL be evaluated according to dependency order.

Example:

```
Sketch001

   ↓

Extrude001

   ↓

Fillet001

   ↓

Hole001
```

---

# 31. Regeneration States

The system SHALL track:

```
Regeneration State

├── Up To Date
│
├── Dirty
│
├── Computing
│
├── Failed
│
└── Cancelled
```

---

# 32. Partial Regeneration

The system SHOULD support partial rebuild.

Example:

Before:

```
Sketch001

 ↓

Extrude001

 ↓

Fillet001

 ↓

Hole001
```

Change:

```
Fillet001
```

Only affected nodes regenerate.

---

# 33. Feature Scheduler

The Feature Scheduler SHALL control evaluation order.

Architecture:

```text
Feature Scheduler


├── Dependency Resolver
│
├── Execution Queue
│
├── Priority Manager
│
└── Error Handler
```

---

# 34. Rollback System

The Feature System SHALL support rollback.

Rollback allows users to inspect previous model states.

Example:

```
Feature Tree


Sketch001

Extrude001

Fillet001   ◄ rollback point

Hole001
```

---

# 35. Rollback Flow

```text
Select Feature

       │

       ▼

Create Temporary State

       │

       ▼

Suppress Later Features

       │

       ▼

Display Previous Model
```

---

# 36. Suppression System

Features MAY be temporarily disabled.

Example:

```
Feature Tree


Sketch001

Extrude001

Fillet001  (Suppressed)

Hole001
```

---

# 37. Suppression Rules

Suppressed features:

- SHALL not generate output.
- SHALL preserve parameters.
- SHALL remain in history.
- SHALL be restorable.

---

# End of Part 2 / 4


Next:

ADR-0015 Part 3 / 4

Sections:

38. Feature Types
39. Feature Registry
40. Feature Editing
41. Feature Versioning
42. Error Handling
43. Feature Events
# 38. Feature Types

The Feature System SHALL provide a modular feature architecture.

Each modeling operation SHALL be implemented as a specialized feature.

---

# 39. Feature Classification

Features SHALL be grouped into categories.

```text
Feature Types


├── Sketch Features
│
├── Reference Features
│
├── Creation Features
│
├── Modification Features
│
├── Pattern Features
│
└── Analysis Features
```

---

# 40. Sketch Features

Sketch features define 2D profiles.

Examples:

```text
Sketch Features

├── Sketch
├── Project Geometry
├── Convert Entity
└── Construction Geometry
```

Output:

```
2D Geometry
```

---

# 41. Reference Features

Reference features provide construction references.

Examples:

```text
Reference Features

├── Plane
├── Axis
├── Point
└── Coordinate System
```

Usage:

```
Reference

      ↓

Feature Input
```

---

# 42. Creation Features

Creation features generate new geometry.

Examples:

```text
Creation Features

├── Extrude
├── Revolve
├── Sweep
├── Loft
└── Boundary Surface
```

Architecture:

```text
Profile

  │

  ▼

Creation Feature

  │

  ▼

New Geometry
```

---

# 43. Modification Features

Modification features modify existing geometry.

Examples:

```text
Modification Features

├── Fillet
├── Chamfer
├── Shell
├── Draft
└── Split
```

Flow:

```text
Existing Solid

        │

        ▼

Modification Feature

        │

        ▼

Modified Solid
```

---

# 44. Pattern Features

Pattern features replicate geometry.

Supported patterns:

```text
Pattern Features

├── Linear Pattern
├── Circular Pattern
├── Mirror
└── Fill Pattern
```

Example:

```text
Feature

   +

Pattern Rule

   ↓

Multiple Instances
```

---

# 45. Feature Interface

Every feature SHALL implement a common interface.

Example:

```text
IFeature


├── Create()
├── Validate()
├── Evaluate()
├── Update()
├── Suppress()
├── Serialize()
└── GetResult()
```

---

# 46. Feature Base Class

Common feature data SHALL be provided by a base class.

```text
FeatureBase


├── ID
├── Name
├── Type
├── Parameters
├── Inputs
├── Outputs
├── State
└── Metadata
```

---

# 47. Feature Registry

The system SHALL maintain a registry of available features.

Purpose:

- Feature discovery
- Plugin support
- Version management

---

# 48. Registry Architecture

```text
Feature Registry


├── Feature ID

├── Feature Type

├── Factory

├── Version

└── Metadata
```

---

# 49. Feature Creation Flow

```text
User Action


    │


    ▼


Command System


    │


    ▼


Feature Registry


    │


    ▼


Feature Factory


    │


    ▼


New Feature Instance
```

---

# 50. Plugin Feature Support

The Feature System SHALL support external feature modules.

Plugin feature requirements:

```text
Plugin Feature


├── Feature Interface

├── Metadata

├── Version

├── Dependencies

└── Permissions
```

---

# 51. Feature Editing

Features SHALL support non-destructive editing.

Example:

Before:

```text
Extrude001

Length = 50 mm
```

After:

```text
Extrude001

Length = 100 mm
```

The feature SHALL regenerate automatically.

---

# 52. Feature Edit Flow

```text
User Changes Parameter

          │

          ▼

Command System

          │

          ▼

Feature Update

          │

          ▼

Regeneration Engine

          │

          ▼

Geometry Kernel
```

---

# 53. Feature Versioning

Each feature SHALL maintain a version.

Purpose:

- History compatibility
- File migration
- Plugin compatibility

Example:

```text
Extrude Feature

Version:

1.0

2.0

3.0
```

---

# 54. Feature Migration

When loading older projects:

```text
Old Feature

      │

      ▼

Migration Layer

      │

      ▼

Current Feature
```

---

# 55. Feature Metadata

Every feature SHALL provide metadata.

Example:

```text
Feature Metadata


├── Name

├── Description

├── Category

├── Icon

├── Version

└── Author
```

---

# 56. Feature Error Handling

Feature failures SHALL be explicit.

Example:

```text
Feature Failed


├── Feature ID

├── Error Code

├── Reason

├── Recovery Action

└── Status
```

---

# 57. Feature Events

The Feature System SHALL publish lifecycle events.

Events:

```text
FeatureCreated

FeatureUpdated

FeatureEvaluated

FeatureFailed

FeatureSuppressed

FeatureDeleted
```

---

# 58. Feature Event Flow

```text
Feature Change

       │

       ▼

Feature Event

       │

       ▼

Subscribers

       │

       ▼

UI / History / Analysis
```

---

# End of Part 3 / 4


Next:

ADR-0015 Part 4 / 4

Sections:

59. Feature Dependency Diagram
60. Module Interaction
61. Performance Requirements
62. Implementation Checklist
63. Acceptance Criteria
64. Quality Attributes
65. Open Questions
66. Revision History
67. Decision Summary
68. Approval
# 59. Feature Dependency Diagram

The Feature System SHALL communicate with multiple TamerCAD modules.

High-level dependency architecture:

```text
                         TamerCAD


                            │


                     Feature System


                            │


        ┌───────────────────┼───────────────────┐


        ▼                   ▼                   ▼


 Command System      History Engine      Geometry Kernel


        │                   │                   │


        └───────────────────┼───────────────────┘


                            ▼


                    Final Model State
```

---

# 60. Module Interaction

## Feature Creation Flow

```text
User

 │

 ▼

Input System

 │

 ▼

Command System

 │

 ▼

Feature Manager

 │

 ▼

Feature Factory

 │

 ▼

Feature Instance

 │

 ▼

Regeneration Engine

 │

 ▼

Geometry Kernel
```

---

# 61. Feature Update Flow

When a parameter changes:

```text
Parameter Change


        │


        ▼


Command System


        │


        ▼


Feature Invalidated


        │


        ▼


Dependency Analysis


        │


        ▼


Regeneration Scheduler


        │


        ▼


Affected Features


        │


        ▼


Geometry Update
```

---

# 62. Performance Requirements

The Feature System SHOULD provide:

```text
Operation                 Target


Feature Creation          < 50 ms


Parameter Update          < 200 ms


Simple Regeneration       < 500 ms


Dependency Analysis       < 100 ms
```

Targets SHALL be improved through profiling.

---

# 63. Memory Management

The Feature System SHALL optimize memory usage.

Supported strategies:

```text
Memory Management


├── Shared References
│
├── Lazy Evaluation
│
├── Cached Results
│
├── Feature Snapshots
│
└── Garbage Collection
```

---

# 64. Threading Model

The initial implementation SHALL use controlled execution.

Architecture:

```text
Main Thread


    │


    ▼


Feature Manager


    │


    ▼


Regeneration Queue


    │


    ▼


Geometry Kernel
```

Future versions MAY support:

- Parallel feature evaluation
- Background regeneration
- Distributed computation

---

# 65. Testing Strategy

The Feature System SHALL include:

```text
Testing


├── Feature Creation Tests
│
├── Dependency Tests
│
├── Regeneration Tests
│
├── Parameter Tests
│
├── Rollback Tests
│
├── Serialization Tests
│
└── Performance Tests
```

---

# 66. Implementation Checklist

## Core Feature Infrastructure

- [ ] Feature Base Class
- [ ] Feature Interface
- [ ] Feature Manager
- [ ] Feature Registry
- [ ] Feature Factory


---

## Feature Tree

- [ ] Tree Structure
- [ ] History Ordering
- [ ] Tree Navigation
- [ ] Rollback Support
- [ ] Suppression Support


---

## Dependency System

- [ ] Dependency Graph
- [ ] Dependency Resolver
- [ ] Circular Dependency Detection
- [ ] Change Propagation


---

## Parameter System

- [ ] Parameter Object
- [ ] Expression Engine
- [ ] Unit Conversion
- [ ] Parameter Validation


---

## Regeneration Engine

- [ ] Scheduler
- [ ] Evaluation Pipeline
- [ ] Partial Regeneration
- [ ] Error Recovery


---

## Built-in Features

- [ ] Sketch Feature
- [ ] Extrude Feature
- [ ] Revolve Feature
- [ ] Sweep Feature
- [ ] Loft Feature
- [ ] Fillet Feature
- [ ] Chamfer Feature
- [ ] Pattern Features


---

## Plugin System

- [ ] External Features
- [ ] Version Management
- [ ] Feature Metadata
- [ ] Permission Control


---

# 67. Acceptance Criteria

The Feature System SHALL be considered complete when:

- [ ] Features can be created and edited.
- [ ] Feature dependencies are tracked.
- [ ] Parameter changes regenerate models.
- [ ] Rollback works correctly.
- [ ] Suppression works correctly.
- [ ] Features integrate with Geometry Kernel.
- [ ] History integration works.
- [ ] Plugin features can be added.


---

# 68. Quality Attributes

| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Parametric Capability | 5 | Full design intent support |
| Scalability | 5 | Large feature trees supported |
| Maintainability | 5 | Modular feature architecture |
| Extensibility | 5 | Plugin-ready design |
| Performance | 5 | Dependency based regeneration |
| Reliability | 5 | Validation and rollback |
| Testability | 5 | Independent modules |


---

# 69. Open Questions

- [ ] Should features support multi-threaded evaluation?
- [ ] Should AI-generated features be supported?
- [ ] Should users edit the dependency graph manually?
- [ ] Should feature templates be supported?
- [ ] Should cloud regeneration be considered?


---

# 70. Revision History

| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial Feature System architecture |


---

# 71. Decision Summary

TamerCAD SHALL use a feature-based parametric modeling architecture.

Every modeling operation SHALL exist as a Feature.

The Feature System SHALL provide:

- Feature history
- Dependency tracking
- Parametric updates
- Regeneration
- Rollback
- Suppression
- Plugin extensibility


The Feature System SHALL act as the bridge between:

```text
User Intent

     │

     ▼

Feature Model

     │

     ▼

Geometry Kernel

     │

     ▼

Final CAD Model
```

This architecture establishes the foundation required for a
professional parametric CAD application.


---

# 72. Approval

Approved By:

Project Founder

Pardus26


Architecture Assistant

ChatGPT


Approval Date:

2026-07-31


Document Status:

Accepted