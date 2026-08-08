# ADR-0012 — Project File Format Architecture

## 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0012 |
| Document Type | Architecture Decision Record |
| Title | Project File Format Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Last Updated | 2026-07-31 |
| Next Review | 2027-01-31 |
| Project | TamerCAD |
| Module | Project File Format |
| Related Documents | ADR-0003, ADR-0004, ADR-0009, ADR-0011 |

---

# 2. Purpose

This ADR defines the internal structure, serialization strategy,
versioning model and compatibility rules for TamerCAD project files.

The file format SHALL prioritize:

- Long-term stability
- Backward compatibility
- Extensibility
- Data integrity
- Efficient loading
- Efficient saving

---

# 3. Scope

The Project File Format SHALL define:

- File container
- Internal directory layout
- Manifest
- Schema versioning
- Geometry storage
- Sketch storage
- History storage
- Metadata
- Preview generation
- Plugin data
- Validation rules
- Migration strategy

Future revisions MAY introduce:

- Incremental saves
- Partial loading
- Streaming
- Cloud synchronization
- Digital signatures

---

# 4. Non-Goals

The Project File Format MUST NOT define:

- Rendering behavior
- Geometry algorithms
- Constraint solving
- UI configuration
- Runtime caches

These responsibilities belong to other subsystems.

---

# 5. Definitions

**Container**

The outer project package.

**Manifest**

The central metadata document describing the project.

**Schema Version**

The version of the internal file format.

**Migration**

Transformation of project data from one schema version to another.

**Asset**

Any binary or structured resource stored inside the project.

---

# 6. Problem Statement

Professional CAD projects grow over many years.

Without a stable file architecture:

- Projects become unreadable.
- Version upgrades break compatibility.
- Plugins become difficult to support.
- Collaboration becomes unreliable.

The format must therefore be deterministic,
self-describing and extensible.

---

# 7. Decision

The official project extension SHALL be:

```text
.tcad
```

A `.tcad` project SHALL be a ZIP-based container.

The internal structure SHALL remain independent from operating systems.

The file format SHALL use UTF-8 encoding for all text resources.

---

# 8. Alternatives Considered

## Alternative A — Single JSON File

Pros

- Simple
- Easy debugging

Cons

- Poor scalability
- Large memory footprint
- Weak binary support

---

## Alternative B — SQLite Database

Pros

- Fast queries
- Mature technology

Cons

- Harder manual inspection
- Plugin complexity
- Migration overhead

---

## Alternative C — ZIP Container (Chosen)

Pros

- Cross-platform
- Binary friendly
- Human-inspectable
- Supports previews
- Supports plugin assets
- Familiar archive model

Cons

- Requires archive management

---

# 9. Rationale

A ZIP-based container provides:

- Excellent interoperability
- Efficient compression
- Flexible internal organization
- Independent resource management
- Proven longevity (similar to Office Open XML, APK and ODF)

---

# 10. High-Level Architecture

```text
                Project (.tcad)
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     Manifest      Data Files     Resources
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                  CAD Kernel
```

---

# 11. Container Structure

```text
Project.tcad
│
├── manifest.json
├── project/
├── sketches/
├── geometry/
├── history/
├── metadata/
├── previews/
├── resources/
├── plugins/
└── thumbnails/
```

Every top-level directory SHALL have a clearly defined responsibility.

---

# 12. Manifest

The manifest SHALL be the entry point for every project.

Example:

```text
manifest.json

├── Schema Version
├── Project Version
├── Application Version
├── Project UUID
├── Creation Date
├── Last Modified
├── Units
├── Author
├── Locale
├── Dependencies
└── Extensions
```

The manifest SHALL be loaded before any other project data.

---

# 13. Directory Responsibilities

```text
project/
    Project metadata

geometry/
    Solids
    Bodies
    Surfaces

sketches/
    Sketch entities

history/
    Transactions

metadata/
    User metadata

previews/
    Render previews

resources/
    Fonts
    Images
    Materials

plugins/
    Plugin-owned data
```

---

# 14. File Identification

Each project SHALL contain:

- Project UUID
- Schema Version
- Application Version
- Checksum Metadata
- Creation Timestamp
- Modification Timestamp

These identifiers SHALL uniquely identify a project instance.

---

# 15. Schema Versioning

Example:

```text
Schema

1.0.0
1.1.0
2.0.0
```

Rules:

- Major → Breaking format changes
- Minor → Backward-compatible additions
- Patch → Metadata corrections

Every saved project MUST include its schema version.

---

# End of Part 1

Continue with:

ADR-0012 Part 2

Sections:

16. Serialization
17. Geometry Storage
18. Sketch Storage
19. History Storage
20. Metadata
21. Preview Images
22. Plugin Data
23. Validation
# 16. Serialization

The TamerCAD project format SHALL use a layered serialization system.

The serialization layer SHALL separate:

- Structural project data
- Geometric data
- Runtime metadata
- External resources
- Plugin extensions

The serialization system MUST support:

- Loading
- Saving
- Validation
- Migration
- Partial recovery

---

# 17. Serialization Architecture

```text
                 Serialization System

                         │

        ┌────────────────┼────────────────┐

        ▼                ▼                ▼

   JSON Serializer   Binary Serializer   Resource Serializer

        │                │                │

        └────────────────┼────────────────┘

                         ▼

                  Project Container
```

---

# 18. Data Format Strategy

The project format SHALL use multiple data representations.

## Structured Data

Format:

```text
JSON
```

Used for:

- Manifest
- Metadata
- Parameters
- Configuration
- Feature definitions


## Binary Data

Format:

```text
Binary Blocks
```

Used for:

- Large geometry
- Mesh data
- Cached calculations
- Preview data


## Resource Data

Format:

```text
External Assets
```

Used for:

- Images
- Materials
- Fonts
- User resources

---

# 19. Geometry Storage

Geometry data SHALL be stored independently from feature definitions.

Architecture:

```text
Geometry Storage

├── Bodies
│
├── Solids
│
├── Faces
│
├── Edges
│
├── Vertices
│
└── Topology
```

---

# 20. Geometry Identification

Every geometric entity SHALL contain:

```text
Geometry Entity

├── UUID
├── Type
├── Parent
├── Children
├── Topology References
├── Attributes
└── Version
```

Entity identifiers MUST remain stable during normal editing.

---

# 21. Parametric Data Storage

Parametric features SHALL NOT store only final geometry.

The system SHALL preserve:

- Feature definition
- Parameters
- References
- Dependencies
- Generated result

Example:

```text
Extrude Feature

├── Profile Reference
├── Distance
├── Direction
├── Operation Type
└── Result Geometry
```

---

# 22. Sketch Storage

Sketches SHALL be stored separately.

Structure:

```text
Sketch

├── Geometry
│
├── Constraints
│
├── Dimensions
│
├── Coordinate System
│
└── Metadata
```

---

# 23. Feature Tree Storage

The project SHALL preserve the modeling history tree.

Example:

```text
Feature Tree

Origin

├── Sketch001
│
├── Extrude001
│
├── Fillet001
│
└── Pattern001
```

The tree structure SHALL be synchronized with History Engine records.

---

# 24. History Storage

History data SHALL use transaction-based storage.

Structure:

```text
history/

├── transactions/
│
├── snapshots/
│
└── checkpoints/
```

Transaction example:

```text
Transaction

├── ID
├── Timestamp
├── Command List
├── Parameters
└── Result
```

---

# 25. Metadata Storage

Metadata SHALL contain project-level information.

Example:

```text
metadata/

├── author.json
├── preferences.json
├── units.json
└── custom.json
```

Supported metadata:

- Author
- Company
- Units
- Locale
- Tags
- Notes
- Custom properties

---

# 26. Preview System

Every saved project SHOULD generate preview images.

Structure:

```text
previews/

├── thumbnail.png
├── preview.png
└── viewport.json
```

Preview data SHALL NOT affect project loading.

---

# 27. Plugin Data Storage

Plugins SHALL store their data inside isolated namespaces.

Example:

```text
plugins/

├── plugin.companyA/
│       data.json
│
└── plugin.companyB/
        data.json
```

Rules:

- Plugins MUST NOT modify core data.
- Plugin data MUST be versioned.
- Missing plugins MUST NOT corrupt projects.

---

# 28. Extension Model

Future extensions SHALL use namespaces.

Example:

```json
{
 "extensions": {
   "company.plugin.name": {
      "version": "1.0"
   }
 }
}
```

Namespace collisions MUST be prevented.

---

# 29. Partial Loading Support

The architecture SHOULD support loading only required data.

Example:

```text
Open Project

      │

      ▼

Load Manifest

      │

      ▼

Load Required Modules

      │

      ▼

Load Geometry

      │

      ▼

Display Model
```

This enables large assembly support.

---

# 30. Recovery Strategy

The file system SHALL support corruption recovery.

Recovery sources:

- Manifest backup
- Checkpoints
- Transaction history
- Integrity checks

A damaged preview file MUST NOT prevent project opening.

---

# 31. Validation Flow

```text
Open File

    │

    ▼

Validate Container

    │

    ▼

Validate Manifest

    │

    ▼

Validate Schema

    │

    ▼

Load Data

    │

    ▼

Open Project
```

---

# End of Part 2

Continue with:

ADR-0012 Part 3

Sections:

32. Migration System
33. Version Compatibility
34. Compression Strategy
35. Security Considerations
36. Risks
37. Future Work
38. Related ADRs
39. Affected Modules
40. Implementation Checklist
41. Acceptance Criteria
42. Quality Attributes
43. Open Questions
44. Revision History
45. Decision Summary
46. Approval
# 32. Migration System

The TamerCAD project format SHALL provide a migration system for schema
changes.

Migration SHALL allow older projects to be opened by newer application
versions.

Migration process:

```text
Open Project

      │

      ▼

Read Schema Version

      │

      ▼

Compare Current Version

      │

      ▼

Execute Migration Steps

      │

      ▼

Validate Result

      │

      ▼

Load Project
```

---

# 33. Migration Architecture

```text
                 Migration Engine

                        │

        ┌───────────────┼───────────────┐

        ▼               ▼               ▼

 Migration 1       Migration 2      Migration N

        │               │               │

        └───────────────┼───────────────┘

                        ▼

                Current Schema
```

---

# 34. Migration Rules

The migration system SHALL follow these rules:

- Original project data MUST NOT be overwritten before success.
- Failed migrations MUST rollback.
- Every migration MUST be reversible when possible.
- Migration steps MUST be versioned.
- Migration results MUST be validated.

Example:

```text
Schema 1.0

      │

      ▼

Migration 1.1

      │

      ▼

Migration 2.0
```

---

# 35. Version Compatibility

Compatibility levels:

```text
Version Compatibility

├── Fully Compatible
│
├── Requires Migration
│
├── Read Only
│
└── Unsupported
```

---

# 36. Backward Compatibility

New versions SHOULD support opening older projects.

Example:

```text
TamerCAD 2.0

        can open

TamerCAD 1.0 project
```

Backward compatibility SHOULD continue for multiple major releases.

---

# 37. Forward Compatibility

Unknown data fields MUST be preserved whenever possible.

Example:

```json
{
 "feature": {
    "knownProperty": true,
    "futureProperty": "unknown"
 }
}
```

Older versions SHALL ignore unknown fields without destroying them.

---

# 38. Compression Strategy

The container MAY use compression.

Default:

```text
ZIP Deflate
```

Future options:

- Zstandard
- LZMA
- Custom CAD optimized compression

Compression SHALL NOT affect data integrity.

---

# 39. Integrity Validation

Every important resource SHOULD contain:

```text
Resource Integrity

├── Hash
├── Size
├── Version
└── Type
```

Validation flow:

```text
Load Resource

      │

      ▼

Calculate Hash

      │

      ▼

Compare Metadata

      │

      ▼

Accept / Reject
```

---

# 40. Security Considerations

The project loader SHALL validate:

- Container structure
- Manifest integrity
- Schema version
- Resource references
- Plugin data

The loader MUST protect against:

- Malformed files
- Path traversal attacks
- Invalid references
- Corrupted resources

External resources SHALL require validation before loading.

---

# 41. Risks

Potential risks:

- Format fragmentation
- Migration complexity
- Large file sizes
- Corrupted projects
- Plugin incompatibilities

Mitigation:

- Strict schema rules
- Automated migration tests
- Validation pipeline
- Version locking
- Recovery checkpoints

---

# 42. Future Work

Future improvements:

- Cloud project synchronization
- Incremental save system
- Collaborative editing
- Differential file storage
- Real-time backup
- Project encryption
- Digital signatures
- Distributed asset management

---

# 43. Related ADRs

- ADR-0003 — CAD Engine Architecture
- ADR-0004 — Parametric Modeling
- ADR-0009 — History Engine
- ADR-0011 — Input System

---

# 44. Affected Modules

```text
core/project
core/serialization
core/kernel
core/history
core/migration
core/security
plugins
storage
```

---

# 45. Implementation Checklist

## Container

- [ ] Create .tcad container format
- [ ] ZIP archive handler
- [ ] Directory validation

## Manifest

- [ ] Manifest schema
- [ ] UUID system
- [ ] Version tracking

## Serialization

- [ ] JSON serializer
- [ ] Binary serializer
- [ ] Resource serializer

## Migration

- [ ] Migration engine
- [ ] Schema converters
- [ ] Rollback support

## Integrity

- [ ] Hash verification
- [ ] Corruption detection
- [ ] Recovery system

## Testing

- [ ] Load/save tests
- [ ] Migration tests
- [ ] Compatibility tests
- [ ] Corruption tests
- [ ] Large project tests

---

# 46. Acceptance Criteria

- [ ] .tcad format specification completed.
- [ ] Project container structure defined.
- [ ] Schema versioning implemented.
- [ ] Migration system operational.
- [ ] Backward compatibility verified.
- [ ] Data integrity validation completed.
- [ ] Plugin isolation confirmed.
- [ ] Automated tests pass.

---

# 47. Quality Attributes

| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Performance | 4 | Compression and partial loading supported |
| Scalability | 5 | Container architecture supports growth |
| Maintainability | 5 | Clear separation of data domains |
| Testability | 5 | Versioned validation pipeline |
| Reliability | 5 | Recovery and integrity systems |
| Extensibility | 5 | Plugin namespace architecture |
| Security | 5 | Validation-first loading model |

---

# 48. Open Questions

- [ ] Should .tcad files support encryption?
- [ ] Should cloud synchronization store transaction history separately?
- [ ] Should projects support multiple branches?
- [ ] Should binary geometry use a custom format?
- [ ] Should external references be supported?

---

# 49. Revision History

| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 50. Decision Summary

TamerCAD SHALL use a ZIP-based `.tcad` project container.

The format SHALL separate:

- Geometry
- Features
- History
- Metadata
- Resources
- Extensions

A schema-based migration architecture SHALL guarantee long-term
compatibility.

The project file format is designed as a scalable foundation capable of
supporting professional CAD workflows, collaborative development and
future cloud-based systems.

---

# 51. Approval

Approved By

Project Founder

Pardus26

Architecture Assistant

ChatGPT

Approval Date

2026-07-31

Document Status

Accepted