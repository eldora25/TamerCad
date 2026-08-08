# ADR-0016 — Assembly System Architecture


# 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0016 |
| Document Type | Architecture Decision Record |
| Title | Assembly System Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Project | TamerCAD |
| Module | Assembly System |
| Related Documents | ADR-0003, ADR-0004, ADR-0009, ADR-0013, ADR-0014, ADR-0015 |


---

# 2. Purpose

This ADR defines the architecture of the TamerCAD Assembly System.

The Assembly System SHALL provide the infrastructure required for
multi-component CAD design.

The system SHALL manage:

- Components
- Parts
- Assemblies
- Sub-assemblies
- Mates
- Assembly constraints
- Component instances
- References


---

# 3. Scope

The Assembly System SHALL define:

- Assembly data model
- Component management
- Assembly hierarchy
- Instance system
- Mate system
- Constraint solving
- Reference management
- Assembly regeneration


---

# 4. Non-Goals

The Assembly System MUST NOT:

- Generate low-level geometry.
- Replace the Geometry Kernel.
- Manage individual feature creation.
- Handle rendering directly.

Responsibilities:

```
Geometry Kernel

Feature System

Rendering Engine
```

---

# 5. Definition

An Assembly is a collection of independent components connected
through relationships.

Example:

```
Assembly


├── Component A

├── Component B

└── Component C
```

---

# 6. Problem Statement

Professional CAD systems require the ability to design products
consisting of multiple components.

A single-part model is insufficient for:

- Mechanical products
- Machines
- Electronic enclosures
- Industrial designs


Without an Assembly System:

- Components cannot interact.
- Mechanical relationships cannot be defined.
- Large projects become unmanageable.

---

# 7. Decision

TamerCAD SHALL implement a hierarchical assembly architecture.

The system SHALL separate:

```
Part

from

Assembly

from

Component Instance
```

---

# 8. Assembly Architecture Overview


```
                    Assembly System


                           │


          ┌────────────────┼────────────────┐


          ▼                ▼                ▼


    Assembly Tree     Mate System    Component Manager


          │                │                │


          └────────────────┼────────────────┘


                           ▼


                  Feature System


                           │


                           ▼


                 Geometry Kernel
```

---

# 9. Assembly Module Structure


```
Assembly System


├── Assembly Manager
│
├── Component Manager
│
├── Assembly Tree
│
├── Instance System
│
├── Mate System
│
├── Constraint Solver
│
├── Reference Manager
│
└── Assembly Validator
```

---

# 10. Assembly Data Model


An assembly SHALL contain:


```
Assembly


├── Assembly ID

├── Name

├── Components

├── Sub Assemblies

├── Mates

├── References

├── Configuration

└── Metadata
```

---

# 11. Component Model


A Component represents a reusable design unit.


```
Component


├── Component ID

├── Source File

├── Part Reference

├── Transform

├── Properties

└── Metadata
```

---

# 12. Component Instance


A component MAY have multiple instances.

Example:


```
Assembly


├── Bolt_001

├── Bolt_002

├── Bolt_003
```


Each instance SHALL maintain:

```
Instance


├── Position

├── Rotation

├── Configuration

└── State
```

---

# 13. Assembly Tree


The Assembly Tree SHALL represent product structure.


Example:


```
Vehicle Assembly


├── Engine Assembly

│

├── Transmission Assembly

│

└── Body Assembly
```


---

# 14. Assembly Hierarchy


The system SHALL support nested assemblies.


```
Top Assembly


     │


     ├── Sub Assembly A


     │        │


     │        └── Part


     │


     └── Sub Assembly B
```


---

# 15. Component Reference System


Components SHALL reference external or internal parts.


Reference types:


```
References


├── Geometry Reference

├── Feature Reference

├── Coordinate Reference

└── Mate Reference
```


---

# 16. Assembly Data Flow


```
Create Component


        │


        ▼


Insert Into Assembly


        │


        ▼


Apply Mates


        │


        ▼


Constraint Solver


        │


        ▼


Solved Assembly
```


---

# End of Part 1 / 4


Next:

ADR-0016 Part 2 / 4

Sections:

17. Mate System
18. Assembly Constraints
19. Constraint Solver
20. Degrees Of Freedom
21. Component Positioning
22. Assembly Validation
# 17. Mate System

The Mate System defines relationships between assembly components.

A Mate describes how two components interact in space.

Examples:

```
Bolt

   +

Hole

   =

Fixed Relationship
```

---

# 18. Mate Architecture

```text
                 Mate System


                      │


        ┌─────────────┼─────────────┐


        ▼             ▼             ▼


    Mate Types    References    Solver Input


        │             │             │


        └─────────────┼─────────────┘


                      ▼


              Constraint Solver
```

---

# 19. Mate Definition

A Mate SHALL contain:

```text
Mate


├── Mate ID

├── Mate Type

├── Component A

├── Component B

├── Reference A

├── Reference B

├── Offset

└── Orientation
```

---

# 20. Mate Types

The initial system SHALL support:

```text
Mate Types


├── Coincident Mate

├── Distance Mate

├── Angle Mate

├── Parallel Mate

├── Perpendicular Mate

├── Concentric Mate

└── Fixed Mate
```

---

# 21. Coincident Mate

Aligns two geometric references.

Example:

```
Face A

   │

   ▼

Face B
```

Result:

```
Position = Same
```

---

# 22. Distance Mate

Maintains a fixed distance.

Example:

```
Component A


        50 mm


Component B
```

Parameter:

```
Distance = 50mm
```

---

# 23. Angle Mate

Controls angular relationships.

Example:

```
Component A

      /

     / 45°

    /

Component B
```

Parameter:

```
Angle = 45°
```

---

# 24. Concentric Mate

Aligns circular entities.

Example:

```
Circle A

    ◎

    │

    ◎

Circle B
```

Used for:

- Shafts
- Bearings
- Holes
- Fasteners

---

# 25. Fixed Mate

Locks a component position.

Example:

```
Component


Position Locked

Rotation Locked
```

---

# 26. Assembly Constraint System

The Constraint System determines valid component positions.

Responsibilities:

- Solve relationships.
- Remove degrees of freedom.
- Detect conflicts.
- Maintain assembly stability.

---

# 27. Constraint Architecture

```text
                Assembly Constraints


                         │


        ┌────────────────┼────────────────┐


        ▼                ▼                ▼


   Mate Rules       Equations       Solver


                         │


                         ▼


              Component Positions
```

---

# 28. Degrees Of Freedom (DOF)

Every component initially has:

```
6 Degrees Of Freedom


Translation:

X
Y
Z


Rotation:

Rx
Ry
Rz
```

---

# 29. DOF Reduction

Constraints reduce movement freedom.

Example:

Before:

```
Component

X Y Z Rx Ry Rz

6 DOF
```

After fixed mate:

```
0 DOF
```

---

# 30. Constraint Solving Flow

```text
Assembly Created


       │


       ▼


Collect Constraints


       │


       ▼


Build Equation System


       │


       ▼


Solve Positions


       │


       ▼


Validate Result
```

---

# 31. Constraint Solver

The Constraint Solver SHALL provide:

```text
Solver


├── Equation Builder

├── DOF Analyzer

├── Numerical Solver

├── Conflict Detector

└── Result Validator
```

---

# 32. Solver Strategy

Initial implementation:

```
Iterative Numerical Solver
```

Future support:

```
├── Symbolic Solver

├── Parallel Solver

└── AI Assisted Solver
```

---

# 33. Constraint Conflicts

The system SHALL detect invalid assemblies.

Example:

```
Constraint A

Distance = 50mm


Constraint B

Distance = 100mm
```

Result:

```
Conflict Detected
```

---

# 34. Conflict Resolution

The system SHOULD provide:

```text
Conflict Report


├── Conflicting Mate

├── Components

├── Reason

└── Suggested Fix
```

---

# 35. Component Positioning

Components SHALL maintain transformations.

Transformation model:

```text
Component


├── Translation Vector

├── Rotation Matrix

└── Coordinate System
```

---

# 36. Position Update Flow

```text
Constraint Solver


        │


        ▼


Transformation Update


        │


        ▼


Component Instance


        │


        ▼


Assembly State
```

---

# 37. Assembly Validation

The Assembly Validator SHALL check:

```text
Validation


├── Missing References

├── Constraint Conflicts

├── Broken Components

├── Circular Dependencies

└── Invalid Positions
```

---

# End of Part 2 / 4


Next:

ADR-0016 Part 3 / 4

Sections:

38. Assembly Configurations
39. Sub Assembly System
40. Component Library
41. External References
42. Assembly File Structure
43. Large Assembly Management
# 38. Assembly Configurations

The Assembly System SHALL support multiple configurations of the
same assembly.

Configurations allow different product states without creating
separate files.

---

# 39. Configuration Architecture

```text
Assembly


├── Configuration A
│
│    ├── Component States
│    └── Mate States
│
│
├── Configuration B
│
│    ├── Component States
│    └── Mate States
│
│
└── Configuration C
```

---

# 40. Configuration Data Model

Each configuration SHALL contain:

```text
Configuration


├── Configuration ID

├── Name

├── Active Components

├── Suppressed Components

├── Mate States

├── Parameter Overrides

└── Metadata
```

---

# 41. Configuration Use Cases

Configurations support:

```text
Examples


├── Manufacturing Version

├── Assembly State

├── Product Variant

├── Simplified Model

└── Exploded View State
```

---

# 42. Sub Assembly System

The Assembly System SHALL support nested assemblies.

A sub-assembly is an independent assembly used inside another
assembly.

---

# 43. Sub Assembly Architecture

```text
Main Assembly


      │


      ├── Sub Assembly A


      │        │


      │        ├── Component 1


      │        └── Component 2


      │


      └── Sub Assembly B
```

---

# 44. Sub Assembly Rules

A sub-assembly SHALL:

- Have its own component tree.
- Maintain internal constraints.
- Expose external references.
- Be reusable.

---

# 45. Assembly Context

Components MAY behave differently depending on placement.

Example:

```
Same Component


Assembly A

Position X


Assembly B

Position Y
```

The source component remains unchanged.

---

# 46. Component Library

The Assembly System SHALL provide reusable component management.

---

# 47. Component Library Architecture

```text
Component Library


├── Parts

├── Assemblies

├── Templates

├── Standard Components

└── User Components
```

---

# 48. Standard Component Support

Future versions SHOULD support:

```text
Standard Components


├── Bolts

├── Nuts

├── Bearings

├── Profiles

├── Fasteners

└── Mechanical Parts
```

---

# 49. External References

The Assembly System SHALL support external component references.

A component MAY exist:

```
Inside Current Project

or

External File
```

---

# 50. External Reference Model

```text
Assembly


      │


      ▼


External Reference


      │


      ▼


Component File


      │


      ▼


Feature System


      │


      ▼


Geometry Kernel
```

---

# 51. Reference Management

The Reference Manager SHALL track:

```text
Reference


├── Source File

├── Entity ID

├── Version

├── Status

└── Update State
```

---

# 52. Reference States

External references SHALL have states:

```text
Reference State


├── Valid

├── Updated

├── Missing

├── Broken

└── Conflict
```

---

# 53. Large Assembly Management

The Assembly System SHALL support large assemblies.

Large assemblies require:

- Memory optimization.
- Loading optimization.
- Display optimization.
- Selective regeneration.

---

# 54. Lightweight Components

The system SHOULD support lightweight loading.

Example:

Normal:

```text
Component

Geometry

Features

History

Metadata
```

Lightweight:

```text
Component

Bounding Box

Reference Data

Visualization Data
```

---

# 55. Assembly Loading Strategy

```text
Open Assembly


        │


        ▼


Load Structure


        │


        ▼


Load Required Components


        │


        ▼


Resolve References


        │


        ▼


Display Assembly
```

---

# 56. Assembly Cache System

The Assembly System SHALL support caching.

Cache data:

```text
Cache


├── Component State

├── Transform Data

├── Display Data

├── Constraint Result

└── Reference Map
```

---

# 57. Assembly Performance Strategy

Optimization methods:

```text
Performance


├── Lazy Loading

├── Component Instancing

├── Cached Solving

├── Partial Update

└── Level Of Detail
```

---

# End of Part 3 / 4


Next:

ADR-0016 Part 4 / 4

Sections:

58. Assembly Module Dependency Diagram
59. Data Flow Diagrams
60. Implementation Checklist
61. Acceptance Criteria
62. Quality Attributes
63. Open Questions
64. Revision History
65. Decision Summary
66. Approval
# 58. Assembly Module Dependency Diagram

The Assembly System SHALL integrate with core TamerCAD modules.

High-level architecture:


```text
                         TamerCAD


                            │


                    Assembly System


                            │


      ┌─────────────────────┼─────────────────────┐


      ▼                     ▼                     ▼


 Component Manager     Mate System        Assembly Tree


      │                     │                     │


      └─────────────────────┼─────────────────────┘


                            ▼


                   Constraint Solver


                            │


                            ▼


                    Feature System


                            │


                            ▼


                  Geometry Kernel
```

---

# 59. Detailed Module Interaction


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


Assembly Manager


 │


 ├──────────────► Component Manager


 │


 ├──────────────► Mate Manager


 │


 ├──────────────► Constraint Solver


 │


 ▼


Assembly State


 │


 ▼


Feature System


 │


 ▼


Geometry Kernel
```

---

# 60. Assembly Data Flow


## Component Insert Flow


```text
Select Component


        │


        ▼


Load Component Data


        │


        ▼


Create Instance


        │


        ▼


Add To Assembly Tree


        │


        ▼


Apply Constraints


        │


        ▼


Solve Position
```


---

## Assembly Update Flow


```text
Component Change


        │


        ▼


Detect Dependencies


        │


        ▼


Update Constraints


        │


        ▼


Recalculate Positions


        │


        ▼


Update Assembly State
```

---

# 61. Assembly File Structure


The project file SHALL store assembly information separately from
individual component data.


Example:


```text
Project


├── Assembly

│

│   ├── Assembly Data

│   ├── Component References

│   ├── Mate Definitions

│   └── Configuration Data


│

├── Components

│

│   ├── Part001

│   ├── Part002

│   └── Part003
```

---

# 62. Serialization Model


Assembly serialization SHALL contain:


```text
Assembly File


├── Metadata

├── Components

├── Instances

├── Transformations

├── Mates

├── Constraints

├── Configurations

└── References
```

---

# 63. Implementation Checklist


## Assembly Core

- [ ] Assembly Manager
- [ ] Assembly Data Model
- [ ] Assembly Tree
- [ ] Component Manager
- [ ] Instance System


---

## Mate System

- [ ] Mate Interface
- [ ] Coincident Mate
- [ ] Distance Mate
- [ ] Angle Mate
- [ ] Concentric Mate
- [ ] Fixed Mate


---

## Constraint Solver

- [ ] DOF System
- [ ] Equation Builder
- [ ] Solver Engine
- [ ] Conflict Detection
- [ ] Result Validation


---

## References

- [ ] External References
- [ ] Reference Tracking
- [ ] Version Control
- [ ] Broken Reference Detection


---

## Performance

- [ ] Lightweight Components
- [ ] Lazy Loading
- [ ] Component Instancing
- [ ] Assembly Cache
- [ ] Large Assembly Optimization


---

## Testing

- [ ] Assembly Creation Tests
- [ ] Mate Tests
- [ ] Solver Tests
- [ ] Reference Tests
- [ ] Performance Tests


---

# 64. Acceptance Criteria


The Assembly System SHALL be considered complete when:


- [ ] Components can be inserted.
- [ ] Components can be positioned.
- [ ] Mates can define relationships.
- [ ] Constraints can be solved.
- [ ] Sub assemblies work.
- [ ] External references work.
- [ ] Configurations work.
- [ ] Large assemblies remain usable.


---

# 65. Quality Attributes


| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Scalability | 5 | Large assembly support |
| Performance | 5 | Optimized loading |
| Maintainability | 5 | Modular architecture |
| Extensibility | 5 | New mate types possible |
| Reliability | 5 | Constraint validation |
| Compatibility | 5 | External references |


---

# 66. Open Questions


- [ ] Should real-time kinematics be included?
- [ ] Should motion simulation be separated?
- [ ] Should assembly configurations support variants?
- [ ] Should cloud-based assembly solving be supported?
- [ ] Should AI-assisted mate creation be added?


---

# 67. Revision History


| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial Assembly System architecture |


---

# 68. Decision Summary


TamerCAD SHALL implement a dedicated Assembly System.

The Assembly System SHALL provide:

- Component management
- Assembly hierarchy
- Mate relationships
- Constraint solving
- External references
- Large assembly optimization


The final architecture:


```text
                    Assembly


                       │


              Component Instances


                       │


                    Mates


                       │


              Constraint Solver


                       │


                Solved Structure


                       │


              Feature System


                       │


              Geometry Kernel
```


This architecture enables TamerCAD to support professional
multi-component CAD workflows.


---

# 69. Approval


Approved By:

Project Founder

Pardus26


Architecture Assistant

ChatGPT


Approval Date:

2026-07-31


Document Status:

Accepted