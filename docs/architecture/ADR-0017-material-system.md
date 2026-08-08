# ADR-0017 — Material System Architecture


# 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0017 |
| Document Type | Architecture Decision Record |
| Title | Material System Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Project | TamerCAD |
| Module | Material System |
| Related Documents | ADR-0014, ADR-0015, ADR-0016 |


---

# 2. Purpose

This ADR defines the architecture of the TamerCAD Material System.

The Material System SHALL provide a unified framework for managing
physical, visual and manufacturing properties of CAD objects.


The system SHALL manage:

- Material definitions
- Physical properties
- Appearance properties
- Manufacturing information
- Material libraries
- Mass calculations


---

# 3. Scope

The Material System SHALL define:


```
Material System


├── Material Database

├── Material Definition

├── Physical Properties

├── Appearance System

├── Manufacturing Data

├── Library Management

└── Property Calculation
```

---

# 4. Non-Goals

The Material System MUST NOT:

- Generate geometry.
- Modify topology.
- Control rendering directly.
- Replace simulation engines.


Responsibilities:

```
Geometry Kernel

Rendering Engine

Simulation System
```

---

# 5. Definition

A Material represents a collection of properties assigned to a
CAD entity.


Example:

```
Part


   │


   ▼


Material Assignment


   │


   ▼


Steel Properties
```

---

# 6. Problem Statement

Professional CAD systems require more than geometric representation.

A component must contain information about:

- What it is made from.
- How heavy it is.
- How it looks.
- How it can be manufactured.


Without a Material System:

- Mass calculation is impossible.
- Appearance management becomes inconsistent.
- Manufacturing workflows cannot be integrated.


---

# 7. Decision

TamerCAD SHALL implement a centralized Material System.

All material information SHALL be stored independently from geometry.


Architecture:


```
Geometry


    │


    ▼


Entity Reference


    │


    ▼


Material System


    │


    ├── Physical Properties

    ├── Appearance

    └── Manufacturing Data
```

---

# 8. Material Architecture Overview


```
                     Material System


                           │


          ┌────────────────┼────────────────┐


          ▼                ▼                ▼


 Material Database   Property Engine   Appearance


          │                │                │


          └────────────────┼────────────────┘


                           ▼


                    CAD Entities
```

---

# 9. Material System Components


```
Material System


├── Material Manager

├── Material Database

├── Property Calculator

├── Appearance Manager

├── Library Manager

├── Assignment System

└── Material Validator
```

---

# 10. Material Data Model


Every material SHALL contain:


```
Material


├── Material ID

├── Name

├── Category

├── Physical Properties

├── Appearance Properties

├── Manufacturing Properties

├── Version

└── Metadata
```

---

# 11. Material Assignment Model


A material MAY be assigned to:


```
Material Assignment


├── Part

├── Body

├── Feature Result

└── Component
```

---

# 12. Assignment Architecture


```
CAD Entity


    │


    ▼


Material Reference


    │


    ▼


Material Database


    │


    ▼


Material Properties
```

---

# 13. Material Categories


The system SHALL support material classification.


```
Materials


├── Metals

│    ├── Steel

│    ├── Aluminum

│    └── Titanium


├── Plastics

│    ├── ABS

│    ├── PLA

│    └── Nylon


├── Composites

└── Custom Materials
```

---

# 14. Material Identification


Each material SHALL have:


```
Material Identity


├── Unique ID

├── Display Name

├── Category

├── Standard Code

└── Description
```

---

# 15. Material Library


The system SHALL provide reusable material libraries.


```
Material Library


├── System Materials

├── User Materials

├── Company Materials

└── Imported Materials
```

---

# 16. Material Library Flow


```
Open Material Browser


          │


          ▼


Select Material


          │


          ▼


Assign To Entity


          │


          ▼


Update Properties
```

---

# End of Part 1 / 4


Next:

ADR-0017 Part 2 / 4

Sections:

17. Physical Property System
18. Density Management
19. Mass Calculation
20. Mechanical Properties
21. Appearance System
22. Material Rendering Data
# 17. Physical Property System

The Material System SHALL provide physical property management.

Physical properties describe the engineering behavior of materials.

---

# 18. Physical Property Architecture

```text
              Material


                  │


                  ▼


          Physical Properties


                  │


      ┌───────────┼───────────┐


      ▼           ▼           ▼


 Density      Mass       Mechanical


      │           │           │


      └───────────┼───────────┘


                  ▼


            Engineering Data
```

---

# 19. Supported Physical Properties

The initial system SHALL support:

```text
Physical Properties


├── Density

├── Mass

├── Volume

├── Elastic Modulus

├── Poisson Ratio

├── Yield Strength

├── Thermal Conductivity

└── Melting Point
```

---

# 20. Density Management

Density is a fundamental material property.

The system SHALL use density for:

- Mass calculation.
- Weight estimation.
- Engineering analysis.

---

# 21. Density Data Model

```text
Density


├── Value

├── Unit

├── Temperature Reference

└── Source
```

Example:

```
Aluminum

Density:

2700 kg/m³
```

---

# 22. Mass Calculation System

The Material System SHALL calculate mass automatically.

Formula:

```text
Mass = Volume × Density
```

---

# 23. Mass Calculation Flow

```text
Geometry Kernel


       │


       ▼


Calculate Volume


       │


       ▼


Material Density


       │


       ▼


Mass Calculator


       │


       ▼


Calculated Mass
```

---

# 24. Mass Properties

The system SHALL provide:

```text
Mass Properties


├── Mass

├── Volume

├── Surface Area

├── Center Of Mass

└── Moment Of Inertia
```

---

# 25. Center Of Mass

The Material System SHALL support center of mass calculation.

Data flow:

```text
Geometry


    │


    ▼


Volume Distribution


    │


    ▼


Density Assignment


    │


    ▼


Center Of Mass
```

---

# 26. Mechanical Properties

Materials MAY contain mechanical properties.

Supported properties:

```text
Mechanical Properties


├── Young Modulus

├── Yield Strength

├── Tensile Strength

├── Hardness

├── Fatigue Limit

└── Friction Coefficient
```

---

# 27. Mechanical Property Model

```text
Mechanical Data


├── Property Name

├── Value

├── Unit

├── Test Standard

└── Temperature Range
```

---

# 28. Material Units

The system SHALL support unit conversion.

Examples:

```
Density:

kg/m³

g/cm³


Strength:

MPa

N/mm²
```

---

# 29. Property Validation

The Material Validator SHALL check:

```text
Validation


├── Missing Values

├── Invalid Units

├── Negative Values

├── Out Of Range Data

└── Compatibility
```

---

# 30. Appearance System

The Material System SHALL separate physical properties from
visual properties.

A material can define:

```
Steel


Physical:

Density

Strength


Visual:

Color

Texture

Reflectivity
```

---

# 31. Appearance Architecture

```text
Material


    │


    ▼


Appearance Data


    │


 ┌──┼───────────┐


 ▼              ▼


Color        Texture


 ▼              ▼


Shader      Rendering
```

---

# 32. Appearance Data Model

```text
Appearance


├── Base Color

├── Roughness

├── Metallic Value

├── Transparency

├── Texture

└── Shader Parameters
```

---

# 33. Material Rendering Data

The Rendering Engine SHALL consume appearance data.

Flow:

```text
Material System


       │


       ▼


Appearance Data


       │


       ▼


Rendering Engine


       │


       ▼


Visual Representation
```

---

# 34. Realistic Material Representation

Future versions SHOULD support:

```text
Advanced Appearance


├── PBR Materials

├── Normal Maps

├── Surface Imperfections

├── Anisotropic Effects

└── Procedural Textures
```

---

# 35. Material Override System

Components MAY override material appearance.

Example:

```
Part Material:

Steel


Display Override:

Painted Blue
```

---

# 36. Appearance Inheritance

The system SHALL support inheritance.

Example:

```text
Material


   │


   ▼


Steel


   │


   ▼


Stainless Steel
```

---

# End of Part 2 / 4


Next:

ADR-0017 Part 3 / 4

Sections:

37. Manufacturing Data System
38. Material Library Architecture
39. Import / Export
40. Material Versioning
41. Module Dependencies
# 37. Manufacturing Data System

The Material System SHALL support manufacturing-related
information.

Manufacturing data connects CAD design with production workflows.

---

# 38. Manufacturing Architecture

```text
                    Material


                       │


                       ▼


             Manufacturing Data


                       │


       ┌───────────────┼───────────────┐


       ▼               ▼               ▼


  Process Data   Supplier Data   Standards
```

---

# 39. Manufacturing Properties

The system SHALL support:

```text
Manufacturing Properties


├── Manufacturing Process

├── Supplier Information

├── Material Grade

├── Industry Standard

├── Cost Information

└── Availability
```

---

# 40. Manufacturing Process Types

Supported processes:

```text
Processes


├── CNC Machining

├── Injection Molding

├── Casting

├── Extrusion

├── Forging

├── Sheet Metal

└── Additive Manufacturing
```

---

# 41. Manufacturing Data Model

```text
Manufacturing Data


├── Process Type

├── Process Parameters

├── Supplier

├── Material Grade

├── Certification

└── Notes
```

---

# 42. Material Standards

The system SHOULD support industry standards.

Examples:

```text
Standards


├── ISO

├── ASTM

├── DIN

├── EN

└── Custom Standards
```

---

# 43. Material Library Architecture

The Material Library SHALL provide centralized material storage.

---

# 44. Material Library Structure

```text
Material Library


├── System Library

│
├── Company Library

│
├── User Library

│
└── Imported Library
```

---

# 45. Material Database

The Material Database SHALL store:

```text
Database


├── Material Definitions

├── Properties

├── Appearance Data

├── Manufacturing Data

├── Versions

└── Metadata
```

---

# 46. Material Search System

Users SHALL be able to search materials.

Search criteria:

```text
Search


├── Name

├── Category

├── Density

├── Strength

├── Supplier

└── Standard
```

---

# 47. Material Filtering

The system SHOULD support filtering.

Example:

```
Find:

Aluminum

Density < 3000 kg/m³

Strength > 200 MPa
```

---

# 48. Import / Export System

The Material System SHALL support external material data.

---

# 49. Supported Formats

Initial support:

```text
Formats


├── JSON

├── XML

├── CSV

└── Custom Material Format
```

---

# 50. Import Flow

```text
External File


      │


      ▼


Material Parser


      │


      ▼


Validation


      │


      ▼


Material Database


      │


      ▼


Available Material
```

---

# 51. Export Flow

```text
Material


      │


      ▼


Serializer


      │


      ▼


External Format


      │


      ▼


Saved File
```

---

# 52. Material Versioning

The system SHALL maintain material versions.

Purpose:

- Preserve project compatibility.
- Track property changes.
- Support library updates.

---

# 53. Version Model

```text
Material Version


├── Version Number

├── Created Date

├── Author

├── Changes

└── Compatibility
```

---

# 54. Material Update Strategy

When a material changes:

```text
Material Update


       │


       ▼


Create New Version


       │


       ▼


Validate Projects


       │


       ▼


Apply Update
```

---

# 55. Project Material Locking

Projects MAY lock material versions.

Example:

```
Project A


Uses:


Steel v1.2
```

Even if:

```
Steel v2.0
```

is released, the project remains compatible.

---

# 56. Material Dependency Management

Materials SHALL track dependencies.

Example:

```text
Part


 │


 ▼


Material


 │


 ▼


Material Library
```

---

# 57. Material Cache System

The system SHOULD cache frequently used materials.

Cache:

```text
Material Cache


├── Properties

├── Appearance

├── Metadata

└── Loaded State
```

---

# End of Part 3 / 4


Next:

ADR-0017 Part 4 / 4

Sections:

58. Module Dependency Diagram
59. Material Data Flow
60. Implementation Checklist
61. Acceptance Criteria
62. Quality Attributes
63. Open Questions
64. Revision History
65. Decision Summary
66. Approval
# 58. Material System Dependency Diagram

The Material System SHALL integrate with multiple TamerCAD modules.

High-level architecture:


```text
                         TamerCAD


                            │


                    Material System


                            │


        ┌───────────────────┼───────────────────┐


        ▼                   ▼                   ▼


 Material Manager    Property Engine    Appearance Manager


        │                   │                   │


        └───────────────────┼───────────────────┘


                            ▼


                    CAD Entity System


                            │


          ┌─────────────────┼─────────────────┐


          ▼                                   ▼


 Feature System                       Assembly System


          │                                   │


          └─────────────────┬─────────────────┘


                            ▼


                   Geometry Kernel
```

---

# 59. Material Data Flow

## Material Assignment Flow


```text
User Selects Material


          │


          ▼


Material Browser


          │


          ▼


Material Manager


          │


          ▼


Material Database


          │


          ▼


CAD Entity


          │


          ▼


Updated Properties
```

---

## Mass Calculation Flow


```text
Geometry Kernel


        │


        ▼


Calculate Volume


        │


        ▼


Request Material Density


        │


        ▼


Property Calculator


        │


        ▼


Calculate Mass


        │


        ▼


Engineering Result
```

---

## Rendering Data Flow


```text
Material


    │


    ▼


Appearance Manager


    │


    ▼


Rendering Data


    │


    ▼


Rendering Engine


    │


    ▼


Visual Output
```

---

# 60. Module Interaction Diagram


```text
                 Material System


                        │


        ┌───────────────┼───────────────┐


        ▼               ▼               ▼


  Feature System   Assembly System   Rendering Engine


        │               │               │


        └───────────────┼───────────────┘


                        ▼


                 Material Database


                        │


                        ▼


              Physical Property Engine
```

---

# 61. Implementation Checklist


## Material Core

- [ ] Material Manager
- [ ] Material Data Model
- [ ] Material Assignment System
- [ ] Material Validator
- [ ] Material Metadata


---

## Physical Properties

- [ ] Density System
- [ ] Mass Calculator
- [ ] Volume Integration
- [ ] Center Of Mass
- [ ] Mechanical Properties


---

## Appearance System

- [ ] Appearance Data Model
- [ ] Color Management
- [ ] Texture Support
- [ ] Shader Parameters
- [ ] Rendering Integration


---

## Manufacturing Data

- [ ] Manufacturing Properties
- [ ] Material Standards
- [ ] Supplier Information
- [ ] Process Data
- [ ] Certification Data


---

## Material Library

- [ ] System Library
- [ ] User Library
- [ ] Company Library
- [ ] Search System
- [ ] Filtering System


---

## Import / Export

- [ ] JSON Support
- [ ] XML Support
- [ ] CSV Support
- [ ] Material Parser
- [ ] Serializer


---

## Version Management

- [ ] Material Versioning
- [ ] Compatibility Checking
- [ ] Migration Support
- [ ] Project Locking


---

# 62. Acceptance Criteria


The Material System SHALL be considered complete when:


- [ ] Materials can be created.
- [ ] Materials can be assigned to entities.
- [ ] Physical properties are calculated.
- [ ] Mass properties are available.
- [ ] Appearance data integrates with rendering.
- [ ] Manufacturing information is stored.
- [ ] Material libraries work.
- [ ] Material versions are managed.


---

# 63. Quality Attributes


| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Extensibility | 5 | Plugin material support |
| Accuracy | 5 | Engineering properties |
| Performance | 5 | Cached materials |
| Maintainability | 5 | Independent module |
| Compatibility | 5 | Version controlled |
| Scalability | 5 | Large libraries |


---

# 64. Open Questions


- [ ] Should cloud material libraries be supported?
- [ ] Should supplier databases be integrated?
- [ ] Should AI material recommendation be added?
- [ ] Should simulation-specific properties be separated?
- [ ] Should manufacturing cost estimation be included?


---

# 65. Revision History


| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial Material System architecture |


---

# 66. Decision Summary


TamerCAD SHALL implement a centralized Material System.

The system SHALL separate:


```text
Geometry

    │

    ▼

Material Assignment

    │

    ▼

Material Properties

    │

    ├── Physical Data

    ├── Appearance Data

    └── Manufacturing Data
```


The Material System becomes the bridge between:

```text
CAD Model

     │

     ▼

Engineering Information

     │

     ▼

Manufacturing Workflow
```


This architecture enables:

- Accurate mass calculation.
- Realistic visualization.
- Engineering analysis preparation.
- Manufacturing integration.

---

# 67. Approval


Approved By:

Project Founder

Pardus26


Architecture Assistant

ChatGPT


Approval Date:

2026-07-31


Document Status:

Accepted