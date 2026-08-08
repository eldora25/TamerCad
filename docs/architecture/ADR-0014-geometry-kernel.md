# ADR-0014 — Geometry Kernel Architecture

## 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0014 |
| Document Type | Architecture Decision Record |
| Title | Geometry Kernel Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Last Updated | 2026-07-31 |
| Project | TamerCAD |
| Module | Geometry Kernel |
| Related Documents | ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0012, ADR-0013 |

---

# 2. Purpose

This ADR defines the architecture of the TamerCAD Geometry Kernel.

The Geometry Kernel SHALL provide the mathematical and topological
foundation required for all CAD operations.

The Geometry Kernel is responsible for:

- Geometric representation
- Topological relationships
- Solid modeling
- Boolean operations
- Precision management
- Spatial queries

---

# 3. Scope

The Geometry Kernel SHALL define:

- Geometric primitives
- Curves
- Surfaces
- Solids
- Topology model
- B-Rep architecture
- Coordinate systems
- Precision handling
- Tolerance system
- Spatial indexing

---

# 4. Non-Goals

The Geometry Kernel MUST NOT:

- Manage user commands
- Handle input devices
- Render graphics
- Store projects
- Define UI behavior

These responsibilities belong to other modules.

---

# 5. Definitions

## Geometry

Mathematical representation of shapes.

Examples:

```
Point
Line
Circle
Curve
Surface
Solid
```

---

## Topology

The relationship between geometric entities.

Examples:

```
Vertex
Edge
Face
Shell
Body
```

---

## B-Rep

Boundary Representation.

A method where solids are represented by their boundaries.

---

## Kernel

The lowest-level mathematical engine used by CAD operations.

---

# 6. Problem Statement

A professional CAD system requires a robust geometry foundation.

Poor geometry architecture causes:

- Invalid solids
- Topology errors
- Precision problems
- Unstable features
- Failed Boolean operations

Therefore TamerCAD requires an independent geometry kernel.

---

# 7. Decision

TamerCAD SHALL use a B-Rep based Geometry Kernel architecture.

The kernel SHALL separate:

```
Geometry

from

Topology
```

---

# 8. Architecture Overview

```
                 Geometry Kernel


                      │


        ┌─────────────┼─────────────┐


        ▼             ▼             ▼


   Geometry       Topology       Modeling


        │             │             │


        └─────────────┼─────────────┘


                      ▼


              CAD Kernel
```

---

# 9. High Level Module Structure

```
Geometry Kernel

├── Geometry Layer
│
├── Topology Layer
│
├── B-Rep Model
│
├── Curve Engine
│
├── Surface Engine
│
├── Solid Engine
│
├── Boolean Engine
│
├── Precision Manager
│
└── Spatial Index
```

---

# 10. Geometry Layer

The Geometry Layer SHALL contain mathematical entities.

Supported primitives:

```
Point

Vector

Line

Circle

Arc

Ellipse

Spline

Plane

Surface

Solid
```

---

# 11. Geometry Primitive Model

Example:

```
Point

├── X
├── Y
└── Z
```

```
Vector

├── X
├── Y
└── Z
```

```
Line

├── Start Point
├── End Point
└── Direction
```

---

# 12. Coordinate System

The Geometry Kernel SHALL use a right-handed coordinate system.

```
          Z

          ▲

          │

          │

          └────────► X

         ╱

        Y
```

Default units:

```
Millimeter (mm)
```

The unit system SHALL remain configurable.

---

# 13. Precision Management

CAD geometry requires controlled numerical precision.

The kernel SHALL define:

```
Precision Manager

├── Floating Point Handling
├── Tolerance Rules
├── Approximation
└── Comparison Methods
```

---

# 14. Tolerance System

Exact equality SHALL NOT be used for floating point geometry.

Example:

Instead of:

```
A == B
```

Use:

```
distance(A,B) < tolerance
```

---

# 15. Tolerance Categories

```
Tolerance

├── Distance Tolerance
│
├── Angular Tolerance
│
├── Coincidence Tolerance
│
└── Intersection Tolerance
```

---

# 16. Geometry Data Flow

```
Sketch Geometry

        │

        ▼

Geometry Kernel

        │

        ▼

Topology Builder

        │

        ▼

Solid Model

        │

        ▼

Rendering / Storage
```

---

# End of Part 1

Continue with:

ADR-0014 Part 2 / 4

Sections:

17. Topology Architecture
18. B-Rep Model
19. Vertex System
20. Edge System
21. Face System
22. Shell and Body System
23. Topological Validation
# 17. Topology Architecture

The TamerCAD Geometry Kernel SHALL maintain a separate topology layer.

The topology layer defines relationships between geometric entities.

The topology system SHALL provide:

- Connectivity information
- Adjacency queries
- Boundary relationships
- Entity ownership
- Model validity checking

---

# 18. Geometry and Topology Separation

The kernel SHALL strictly separate geometry from topology.

Example:

```text
Geometry

Point
Curve
Surface


        +

Topology

Vertex
Edge
Face
```

A geometric entity describes shape.

A topological entity describes relationships.

---

# 19. Topology Hierarchy

The topology model SHALL follow a hierarchical structure.

```text
Topology Model


Body

 │

 └── Shell

        │

        └── Face

              │

              └── Edge

                    │

                    └── Vertex
```

---

# 20. B-Rep Model

TamerCAD SHALL use Boundary Representation (B-Rep)
for solid modeling.

A B-Rep model represents solids using:

- Vertices
- Edges
- Faces
- Shells

---

# 21. B-Rep Architecture

```text
                 Solid


                  │


               Shell


                  │


               Faces


                  │


               Edges


                  │


              Vertices
```

---

# 22. Vertex System

A Vertex represents a zero-dimensional topological entity.

A vertex SHALL contain:

```text
Vertex

├── Vertex ID
├── Point Reference
├── Connected Edges
├── Attributes
└── Version
```

Example:

```text
Vertex001

Position:

X = 10
Y = 20
Z = 0
```

---

# 23. Vertex Rules

Vertices SHALL:

- Have unique identifiers.
- Reference geometric points.
- Maintain edge connectivity.
- Support topology validation.

Invalid vertices MUST be rejected.

---

# 24. Edge System

An Edge represents a one-dimensional boundary entity.

An edge SHALL contain:

```text
Edge

├── Edge ID
├── Curve Reference
├── Start Vertex
├── End Vertex
├── Adjacent Faces
└── Orientation
```

---

# 25. Edge Types

Supported edge geometry:

```text
Edge Geometry

├── Line Edge
│
├── Circular Edge
│
├── Arc Edge
│
├── Spline Edge
│
└── Composite Edge
```

---

# 26. Edge Orientation

Edge direction SHALL be explicitly stored.

Example:

```text
Vertex A

    │

    ▼

Edge

    │

    ▼

Vertex B
```

Orientation is required for:

- Face construction
- Boolean operations
- Surface trimming

---

# 27. Face System

A Face represents a two-dimensional surface region.

A face SHALL contain:

```text
Face

├── Face ID
├── Surface Reference
├── Outer Loop
├── Inner Loops
├── Edges
└── Orientation
```

---

# 28. Face Types

Supported surfaces:

```text
Surface Types

├── Plane
│
├── Cylinder
│
├── Cone
│
├── Sphere
│
├── Torus
│
└── NURBS Surface
```

---

# 29. Loop System

A loop defines a closed boundary on a face.

Structure:

```text
Face

├── Outer Loop

│     ├── Edge
│     ├── Edge
│     └── Edge


└── Inner Loop

      ├── Edge
      ├── Edge
      └── Edge
```

Inner loops represent:

- Holes
- Cutouts
- Internal boundaries

---

# 30. Shell System

A Shell represents a connected collection of faces.

Example:

```text
Shell

├── Face001
├── Face002
├── Face003
└── Face004
```

Shell types:

```text
Shell

├── Closed Shell
│
└── Open Shell
```

---

# 31. Body System

A Body represents a complete CAD solid.

Structure:

```text
Body

├── Body ID
├── Shells
├── Attributes
├── Material
└── Metadata
```

A valid solid SHALL contain a closed shell.

---

# 32. Multi Body Support

The Geometry Kernel SHALL support multiple bodies.

Example:

```text
Part

├── Body001

├── Body002

└── Body003
```

This enables:

- Multi-part modeling
- Assemblies
- Boolean operations

---

# 33. Topological Validation

The kernel SHALL validate topology before accepting models.

Validation checks:

```text
Topology Validation

├── Closed boundaries
├── Edge connectivity
├── Face consistency
├── Shell validity
└── Solid integrity
```

---

# 34. Validation Flow

```text
Create Geometry

        │

        ▼

Build Topology

        │

        ▼

Validate Connectivity

        │

        ▼

Generate Solid

        │

        ▼

Accept Model
```

---

# End of Part 2

Continue with:

ADR-0014 Part 3 / 4

Sections:

35. Curve Engine
36. Surface Engine
37. Solid Modeling
38. Boolean Operations
39. Spatial Index
40. Kernel Services
# 35. Curve Engine

The Curve Engine SHALL provide mathematical representations for
one-dimensional geometric entities.

The Curve Engine is responsible for:

- Curve evaluation
- Point calculation
- Tangent calculation
- Intersection detection
- Curve trimming
- Curve conversion

---

# 36. Curve Architecture

```text
                 Curve Engine


                      │


        ┌─────────────┼─────────────┐


        ▼             ▼             ▼


   Analytic       Parametric     NURBS


        │             │             │


        └─────────────┼─────────────┘


                      ▼


              Geometry Kernel
```

---

# 37. Supported Curve Types

The initial kernel SHALL support:

```text
Curves

├── Line
│
├── Circle
│
├── Arc
│
├── Ellipse
│
├── Bezier Curve
│
└── NURBS Curve
```

---

# 38. Parametric Curve Model

Curves SHALL be represented using parameter space.

Example:

```text
Curve(t)

where:

t = parameter value

Output:

Point(x,y,z)
```

---

# 39. Curve Operations

The Curve Engine SHALL provide:

```text
Curve Operations

├── Evaluate Point
├── Calculate Tangent
├── Calculate Normal
├── Split Curve
├── Trim Curve
├── Reverse Direction
├── Calculate Length
└── Intersect Curve
```

---

# 40. NURBS Support

The kernel SHALL support NURBS curves for advanced CAD modeling.

NURBS provides:

- Freeform geometry
- Industrial surface compatibility
- High precision modeling

Structure:

```text
NURBS Curve

├── Control Points
├── Weights
├── Knot Vector
├── Degree
└── Parameter Domain
```

---

# 41. Surface Engine

The Surface Engine SHALL provide two-dimensional geometric
representations.

Responsibilities:

- Surface evaluation
- Trimming
- Intersection
- Normal calculation
- UV mapping

---

# 42. Surface Architecture

```text
                 Surface Engine


                       │


        ┌──────────────┼──────────────┐


        ▼              ▼              ▼


    Planar        Analytic        NURBS


    Surface       Surface        Surface
```

---

# 43. Supported Surface Types

```text
Surfaces

├── Plane
│
├── Cylinder
│
├── Cone
│
├── Sphere
│
├── Torus
│
└── NURBS Surface
```

---

# 44. Surface Representation

A surface SHALL be represented in parameter space.

Example:

```text
Surface(u,v)

Input:

u parameter

v parameter


Output:

Point(x,y,z)
```

---

# 45. Surface Operations

Required operations:

```text
Surface Operations

├── Evaluate Point
├── Calculate Normal
├── Calculate Curvature
├── Trim Surface
├── Extend Surface
├── Intersect Surface
└── Project Curve
```

---

# 46. UV Parameter System

Faces SHALL use UV coordinates.

Architecture:

```text
3D Space

   │

   ▼

Surface

   │

   ▼

UV Space
```

UV mapping enables:

- Surface trimming
- Texture mapping
- Boundary definition

---

# 47. Solid Modeling Engine

The Solid Engine SHALL convert topology and geometry into valid solids.

Responsibilities:

- Solid creation
- Shell management
- Validation
- Volume calculation
- Mass properties

---

# 48. Solid Representation

```text
Solid

├── Body
│
├── Shell
│
├── Faces
│
├── Edges
│
└── Vertices
```

---

# 49. Solid Operations

The Solid Engine SHALL support:

```text
Operations

├── Create Solid
├── Validate Solid
├── Calculate Volume
├── Calculate Area
├── Calculate Center Of Mass
├── Copy Solid
└── Transform Solid
```

---

# 50. Feature Generation Flow

```text
Sketch

 │

 ▼

Curve Geometry

 │

 ▼

Surface Generation

 │

 ▼

Topology Creation

 │

 ▼

Solid Validation

 │

 ▼

Feature Result
```

---

# 51. Boolean Operations

The Boolean Engine SHALL provide solid combination operations.

Supported operations:

```text
Boolean

├── Union
│
├── Difference
│
└── Intersection
```

---

# 52. Boolean Architecture

```text
Solid A

    │

    +

    │

Solid B

    │

    ▼

Boolean Engine

    │

    ▼

New Solid
```

---

# 53. Boolean Requirements

Boolean operations SHALL:

- Preserve topology validity.
- Maintain entity references where possible.
- Handle tolerance issues.
- Generate valid B-Rep output.

---

# End of Part 3

Continue with:

ADR-0014 Part 4 / 4

Sections:

54. Spatial Index
55. Kernel Services
56. Dependency Diagram
57. Implementation Checklist
58. Acceptance Criteria
59. Quality Attributes
60. Open Questions
61. Revision History
62. Decision Summary
63. Approval
# 54. Spatial Index

The Geometry Kernel SHALL provide spatial indexing capabilities for
efficient geometric queries.

Spatial indexing is required for:

- Selection
- Collision detection
- Intersection search
- Boolean operations
- Rendering optimization

---

# 55. Spatial Index Architecture

```text
                 Spatial Index


                      │


        ┌─────────────┼─────────────┐


        ▼             ▼             ▼


      BVH            R-Tree       Octree


        │             │             │


        └─────────────┼─────────────┘


                      ▼


              Geometry Queries
```

---

# 56. Supported Spatial Queries

The kernel SHALL support:

```text
Spatial Queries

├── Point Search
│
├── Bounding Box Search
│
├── Ray Intersection
│
├── Nearest Entity
│
├── Collision Detection
│
└── Region Selection
```

---

# 57. Bounding Volume System

Every geometric entity SHOULD provide a bounding volume.

Example:

```text
Entity

├── Geometry Data
│
└── Bounding Box

      ├── Min Point
      └── Max Point
```

Bounding volumes SHALL improve query performance.

---

# 58. Kernel Services

The Geometry Kernel SHALL expose services to upper-level modules.

Services:

```text
Geometry Kernel Services

├── Geometry Creation
├── Topology Creation
├── Validation
├── Measurement
├── Transformation
├── Intersection
└── Query
```

---

# 59. Transformation System

The kernel SHALL support geometric transformations.

Supported operations:

```text
Transformations

├── Translation
│
├── Rotation
│
├── Scaling
│
└── Coordinate Conversion
```

---

# 60. Transformation Architecture

```text
Geometry Entity

        │

        ▼

Transformation Matrix

        │

        ▼

New Geometry State
```

---

# 61. Measurement System

The Geometry Kernel SHALL provide measurement operations.

Supported measurements:

```text
Measurements

├── Distance
├── Angle
├── Length
├── Area
├── Volume
├── Radius
└── Center Of Mass
```

---

# 62. Dependency Architecture

```text
                  TamerCAD


                     │


              CAD Kernel


                     │


        ┌────────────┼────────────┐


        ▼            ▼            ▼


 Geometry      Command       History


 Kernel        System        Engine


        │


        ▼


 ┌──────────────┐

 │              │

 ▼              ▼

Sketch       Modeling

Engine       Features


        │

        ▼


 Rendering Engine
```

---

# 63. Geometry Kernel Internal Dependency

```text
Geometry Kernel


├── Math Foundation
│
├── Precision Manager
│
├── Geometry Layer
│
├── Curve Engine
│
├── Surface Engine
│
├── Topology Layer
│
├── B-Rep Model
│
├── Solid Engine
│
├── Boolean Engine
│
└── Spatial Index
```

---

# 64. Performance Requirements

The Geometry Kernel SHOULD provide:

```text
Operation Target

Point Evaluation

< 1 μs


Topology Validation

< 100 ms


Simple Boolean

< 500 ms
```

Actual values SHALL be refined through benchmarks.

---

# 65. Memory Management

The kernel SHALL support:

- Shared geometry references
- Lazy evaluation
- Object pooling
- Cache management
- Memory cleanup

Large assemblies MUST be handled efficiently.

---

# 66. Error Handling

Geometry failures SHALL generate structured errors.

Example:

```text
Geometry Error

├── Error Code
├── Entity ID
├── Operation
├── Description
└── Recovery Suggestion
```

---

# 67. Implementation Checklist

## Geometry Foundation

- [ ] Vector math library
- [ ] Point system
- [ ] Curve primitives
- [ ] Surface primitives

---

## Topology

- [ ] Vertex model
- [ ] Edge model
- [ ] Face model
- [ ] Shell model
- [ ] Body model

---

## B-Rep

- [ ] B-Rep storage
- [ ] Topology traversal
- [ ] Validation engine

---

## Modeling

- [ ] Solid creation
- [ ] Boolean operations
- [ ] Transformations
- [ ] Measurements

---

## Performance

- [ ] Spatial index
- [ ] Cache system
- [ ] Benchmark framework

---

## Testing

- [ ] Geometry tests
- [ ] Topology tests
- [ ] Boolean tests
- [ ] Precision tests
- [ ] Stress tests

---

# 68. Acceptance Criteria

The Geometry Kernel SHALL be considered complete when:

- [ ] Valid B-Rep solids can be created.
- [ ] Geometry and topology are separated.
- [ ] Boolean operations are reliable.
- [ ] Precision rules are enforced.
- [ ] Spatial queries are supported.
- [ ] Large models can be processed.
- [ ] Automated validation passes.

---

# 69. Quality Attributes

| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Performance | 5 | Optimized mathematical core |
| Scalability | 5 | Supports complex assemblies |
| Maintainability | 5 | Layered architecture |
| Testability | 5 | Independent kernel modules |
| Reliability | 5 | Validation-first design |
| Extensibility | 5 | New geometry types possible |
| Precision | 5 | Tolerance-based system |

---

# 70. Open Questions

- [ ] Should TamerCAD implement its own kernel completely?
- [ ] Should external geometry kernels be supported?
- [ ] Should GPU acceleration be added?
- [ ] Should exact arithmetic be supported?
- [ ] Should distributed geometry solving be considered?

---

# 71. Revision History

| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 72. Decision Summary

TamerCAD SHALL implement a dedicated B-Rep based Geometry Kernel.

The Geometry Kernel SHALL provide:

- Mathematical geometry
- Topological modeling
- Solid representation
- Boolean operations
- Precision management
- Spatial queries

The kernel SHALL remain independent from UI, commands and storage.

This architecture establishes a professional CAD foundation capable of
supporting future parametric modeling, assemblies and advanced surface
design.

---

# 73. Approval

Approved By

Project Founder

Pardus26

Architecture Assistant

ChatGPT

Approval Date

2026-07-31

Document Status

Accepted