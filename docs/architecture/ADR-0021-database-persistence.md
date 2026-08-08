# ADR-0021 — Database & Persistence Architecture


# 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0021 |
| Document Type | Architecture Decision Record |
| Title | Database & Persistence Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Project | TamerCAD |
| Module | Database & Persistence System |
| Related Documents | ADR-0012, ADR-0013, ADR-0020 |


---

# 2. Purpose


This ADR defines the persistence architecture of TamerCAD.


The Persistence System is responsible for:

- Saving CAD projects.
- Loading project data.
- Object serialization.
- Version migration.
- Transaction management.
- Cache handling.
- Backup systems.


The system SHALL provide reliable storage for complex
parametric CAD models.


---

# 3. Scope


The Database & Persistence System SHALL define:


```
Persistence System


├── Project Storage

├── Document Database

├── Object Serialization

├── Storage Engine

├── Transaction Manager

├── Version Migration

├── Cache System

├── Backup System

└── Cloud Sync Foundation
```

---

# 4. Non-Goals


The Persistence System MUST NOT:


- Contain modeling logic.
- Perform geometry calculations.
- Replace Geometry Kernel.
- Own UI state.


Responsibility separation:


```
UI

 │

 ▼

Command System

 │

 ▼

Application Model

 │

 ▼

Persistence Layer

 │

 ▼

Storage
```

---

# 5. Definition


TamerCAD projects consist of interconnected objects:


```
Project


├── Documents

├── Features

├── Sketches

├── Constraints

├── Materials

├── Assemblies

└── Metadata
```


The Persistence System converts these objects into a durable
storage format.


---

# 6. Problem Statement


A professional CAD application requires:


- Large project support.
- Fast loading.
- Safe saving.
- Backward compatibility.
- Recovery after failure.


Traditional file saving is insufficient because CAD models contain:

```
Complex Data


├── Parametric History

├── Dependency Graphs

├── References

├── Feature Trees

└── Metadata
```


---

# 7. Decision


TamerCAD SHALL implement a hybrid persistence architecture.


The system SHALL combine:


```
Hybrid Storage


├── Structured Project Database

+

├── Binary Resource Storage

+

├── Cache Layer
```


---

# 8. High Level Architecture


```
                    TamerCAD


                       │


               Persistence Layer


                       │


      ┌────────────────┼────────────────┐


      ▼                ▼                ▼


 Object Store     Cache Manager    Transaction


      │                │                │


      └────────────────┼────────────────┘


                       ▼


               Storage Engine


                       │


      ┌────────────────┼────────────────┐


      ▼                ▼                ▼


 Project DB       Binary Data       Backup
```

---

# 9. Project Storage Architecture


A TamerCAD project SHALL be stored as a package.


Example:


```
Project.tcad


├── project.database

├── geometry/

│   ├── bodies

│   ├── meshes

│   └── resources


├── metadata/

├── cache/

└── backup/
```

---

# 10. Project Container Model


```
Project Container


├── Header

├── Database

├── Resources

├── Version Info

├── Checksums

└── Configuration
```

---

# 11. Document Database


Each project SHALL contain one or more documents.


Example:


```
Project


      │


      ├── Part Document


      │


      ├── Assembly Document


      │


      └── Drawing Document
```

---

# 12. Document Storage Model


```
Document


├── Document ID

├── Name

├── Type

├── Objects

├── Dependencies

└── History
```

---

# 13. Object Persistence


All persistent objects SHALL implement serialization.


Architecture:


```
CAD Object


    │


    ▼


Serializer


    │


    ▼


Storage Format
```

---

# 14. Serialization Model


```
Serializable Object


├── Object ID

├── Type ID

├── Version

├── Properties

├── References

└── Custom Data
```

---

# 15. Object Reference System


CAD objects SHALL reference each other through IDs.


Example:


```
Feature A


      references


Sketch B


      references


Geometry C
```

---

# 16. Reference Resolution


Loading flow:


```
Load Objects


      │


      ▼


Create Object IDs


      │


      ▼


Resolve References


      │


      ▼


Restore Model Graph
```

---

# End of Part 1 / 4


Next:

ADR-0021 Part 2 / 4

Sections:

17. Storage Engine  
18. Transaction System  
19. Undo/Redo Persistence  
20. Cache Architecture  
21. Version Migration  
22. Backup System
# 17. Storage Engine


The Storage Engine provides the low-level persistence layer
for TamerCAD project data.


Responsibilities:


```
Storage Engine


├── Data Writing

├── Data Reading

├── Resource Management

├── Compression

├── Integrity Checking

└── Storage Optimization
```

---

# 18. Storage Architecture


```text
                Persistence Layer


                       │


                       ▼


               Storage Manager


                       │


       ┌───────────────┼───────────────┐


       ▼               ▼               ▼


 Database Store   Binary Store    Resource Store


       │               │               │


       └───────────────┼───────────────┘


                       ▼


                  File System
```

---

# 19. Storage Provider Abstraction


The system SHALL support multiple storage providers.


Architecture:


```
Storage Interface


        │


 ┌──────┼──────┐


 ▼             ▼


Local        Cloud


Storage     Storage


```

---

# 20. Storage Format


The persistence format SHALL support:


```
Project Data


├── Structured Data

├── Binary Geometry

├── Metadata

├── Resources

└── Cache Data
```

---

# 21. Compression System


Large CAD projects require compression support.


Compression targets:


```
Compressible Data


├── Mesh Data

├── Preview Images

├── History Data

└── Temporary Cache
```

---

# 22. Integrity Validation


The Storage Engine SHALL verify data integrity.


Validation:


```
Load Data


    │


    ▼


Checksum Validation


    │


    ▼


Version Check


    │


    ▼


Object Validation


    │


    ▼


Accept / Reject
```

---

# 23. Transaction System


CAD operations can modify thousands of objects.


The Persistence System SHALL support transactions.


Purpose:


```
Transaction Goals


├── Atomic Operations

├── Data Safety

├── Recovery Support

└── Consistency
```

---

# 24. Transaction Architecture


```text
Command


  │


  ▼


Transaction Manager


  │


  ▼


Persistence Layer


  │


  ▼


Storage Engine
```

---

# 25. Transaction Lifecycle


```
Begin Transaction


        │


        ▼


Collect Changes


        │


        ▼


Validate Changes


        │


        ▼


Commit


        │


        ▼


Persist Data
```

---

# 26. Transaction States


```
Transaction


├── Created

├── Active

├── Validating

├── Committed

├── Rolled Back

└── Failed
```

---

# 27. Rollback System


If an operation fails:


```
Operation Failed


       │


       ▼


Rollback Request


       │


       ▼


Restore Previous State


       │


       ▼


Notify System
```

---

# 28. Undo / Redo Persistence


Undo/Redo system SHALL integrate with persistence.


Architecture:


```
Command


  │


  ▼


History Manager


  │


  ▼


Transaction Log


  │


  ▼


Persistence Layer
```

---

# 29. Transaction Log


The system SHALL store operation history.


Example:


```
Transaction Log


├── Transaction ID

├── Command ID

├── Object Changes

├── Timestamp

└── User Context
```

---

# 30. Undo Data Flow


```
User Undo


     │


     ▼


History Manager


     │


     ▼


Find Transaction


     │


     ▼


Restore Previous State


     │


     ▼


Update Model
```

---

# 31. Redo Data Flow


```
User Redo


     │


     ▼


History Manager


     │


     ▼


Replay Transaction


     │


     ▼


Update Model
```

---

# 32. Cache Architecture


The Cache System improves performance for large projects.


Responsibilities:


```
Cache System


├── Memory Cache

├── Disk Cache

├── Geometry Cache

├── Preview Cache

└── Analysis Cache
```

---

# 33. Cache Architecture Diagram


```text
              Application


                    │


                    ▼


              Cache Manager


                    │


       ┌────────────┼────────────┐


       ▼            ▼            ▼


 Memory Cache   Disk Cache   Object Cache


       │            │            │


       └────────────┼────────────┘


                    ▼


             Persistence Layer
```

---

# 34. Cache Strategy


The system SHALL support:


```
Cache Strategy


├── Lazy Loading

├── On Demand Loading

├── Cache Invalidation

├── Cache Refresh

└── Memory Optimization
```

---

# 35. Large Assembly Handling


Large assemblies require selective loading.


Strategy:


```
Assembly


    │


    ▼


Dependency Analysis


    │


    ▼


Load Required Objects


    │


    ▼


Keep Remaining Data Cached
```

---

# 36. Performance Optimization


Persistence performance SHALL be improved by:


```
Optimization


├── Parallel Loading

├── Background Saving

├── Incremental Save

├── Compression

└── Smart Caching
```

---

# End of Part 2 / 4


Next:

ADR-0021 Part 3 / 4

Sections:

37. Version Migration  
38. Backup System  
39. Cloud Sync Foundation  
40. Persistence API  
41. Database Schema  
42. Recovery System
# 37. Version Migration System


TamerCAD projects SHALL remain compatible across application
versions.

The Migration System is responsible for converting older project
formats into newer versions.


Goals:


```
Migration Goals


├── Backward Compatibility

├── Safe Upgrade

├── Data Preservation

├── Automatic Conversion

└── Migration Validation
```

---

# 38. Migration Architecture


```text
              Old Project File


                      │


                      ▼


              Version Detector


                      │


                      ▼


              Migration Manager


                      │


          ┌───────────┼───────────┐


          ▼           ▼           ▼


     Migration A  Migration B  Migration C


          │           │           │


          └───────────┼───────────┘


                      ▼


              Current Project Format
```

---

# 39. Migration Pipeline


```text
Open Project


      │


      ▼


Read Version


      │


      ▼


Compare Schema


      │


      ▼


Apply Migration Steps


      │


      ▼


Validate Data


      │


      ▼


Load Project
```

---

# 40. Migration Rules


Each migration SHALL:


```
Migration Step


├── Have Unique ID

├── Define Source Version

├── Define Target Version

├── Be Reversible When Possible

└── Provide Validation
```

---

# 41. Schema Versioning


Project files SHALL include schema information.


Example:


```json
{
 "formatVersion": "2.1",
 "applicationVersion": "0.1.0"
}
```

---

# 42. Backup System


The Persistence System SHALL provide automatic backups.


Goals:


```
Backup Goals


├── Prevent Data Loss

├── Recover Failed Saves

├── Restore Previous Versions

└── Protect User Work
```

---

# 43. Backup Architecture


```text
              Project Save


                    │


                    ▼


             Backup Manager


                    │


        ┌───────────┼───────────┐


        ▼           ▼           ▼


   Snapshot    Incremental   Archive


        │           │           │


        └───────────┼───────────┘


                    ▼


              Backup Storage
```

---

# 44. Backup Types


Supported backup modes:


```
Backup


├── Manual Backup

├── Automatic Backup

├── Incremental Backup

├── Full Snapshot

└── Recovery Backup
```

---

# 45. Auto Save System


The application SHALL support background saving.


Flow:


```text
Timer Trigger


      │


      ▼


Check Changes


      │


      ▼


Create Snapshot


      │


      ▼


Save Background Copy


      │


      ▼


Update Backup State
```

---

# 46. Recovery System


The system SHALL recover interrupted operations.


Recovery scenarios:


```
Recovery


├── Application Crash

├── Power Failure

├── Corrupted Save

├── Failed Migration

└── Invalid Data
```

---

# 47. Recovery Architecture


```text
Application Start


        │


        ▼


Recovery Manager


        │


        ▼


Check Temporary Data


        │


        ▼


Find Recovery Point


        │


        ▼


Restore Project
```

---

# 48. Cloud Sync Foundation


The architecture SHALL support future cloud synchronization.


Cloud Sync is NOT required for initial release.


Future capabilities:


```
Cloud Sync


├── Remote Storage

├── Version History

├── Multi Device Access

├── Collaboration

└── Conflict Resolution
```

---

# 49. Cloud Sync Architecture


```text
              Local Project


                    │


                    ▼


              Sync Manager


                    │


                    ▼


              Cloud Provider


                    │


        ┌───────────┼───────────┐


        ▼           ▼           ▼


   Storage     Versioning   Sharing
```

---

# 50. Conflict Resolution


Future synchronization SHALL handle conflicts.


Example:


```
Local Change


      │


      ▼


Compare Versions


      │


      ▼


Conflict Detected


      │


      ▼


Resolution Strategy
```

---

# 51. Persistence API


Internal modules SHALL communicate with persistence
through a defined API.


Architecture:


```text
Application Module


        │


        ▼


 Persistence API


        │


        ▼


 Persistence Manager


        │


        ▼


 Storage Engine
```

---

# 52. Persistence API Responsibilities


```
Persistence API


├── Save Object

├── Load Object

├── Query Data

├── Transaction Control

├── Version Check

└── Backup Request
```

---

# 53. Persistence Security


The system SHALL protect project data.


Security measures:


```
Security


├── Integrity Checks

├── Access Validation

├── Safe Serialization

├── Corruption Detection

└── Recovery Support
```

---

# 54. Data Lifecycle


Complete object lifecycle:


```text
Create Object


      │


      ▼


Modify Object


      │


      ▼


Transaction


      │


      ▼


Serialize


      │


      ▼


Store


      │


      ▼


Restore
```

---

# 55. Database Schema Overview


Logical schema:


```text
Project Database


├── Projects

├── Documents

├── Objects

├── References

├── Transactions

├── Metadata

└── Resources
```

---

# 56. Persistence Module Communication


```text
                Application


                     │


                     ▼


             Persistence API


                     │


        ┌────────────┼────────────┐


        ▼            ▼            ▼


 Transaction   Migration    Backup


 Manager       Manager      Manager


        │            │            │


        └────────────┼────────────┘


                     ▼


              Storage Engine
```

---

# End of Part 3 / 4


Next:

ADR-0021 Part 4 / 4

Sections:

57. Persistence Dependency Diagram  
58. Data Flow Diagrams  
59. Implementation Checklist  
60. Acceptance Criteria  
61. Quality Attributes  
62. Open Questions  
63. Revision History  
64. Decision Summary  
65. Approval
# 57. Persistence Dependency Diagram


The Persistence System provides a controlled data layer between
application modules and physical storage.


```text
                         TamerCAD


                            │


                    Application Layer


                            │


                    Persistence API


                            │


        ┌───────────────────┼───────────────────┐


        ▼                   ▼                   ▼


 Transaction          Migration            Backup


 Manager              Manager              Manager


        │                   │                   │


        └───────────────────┼───────────────────┘


                            ▼


                  Persistence Manager


                            │


        ┌───────────────────┼───────────────────┐


        ▼                   ▼                   ▼


 Database Store      Binary Store       Cache Store


        │                   │                   │


        └───────────────────┼───────────────────┘


                            ▼


                     Project Storage
```

---

# 58. Complete Persistence Architecture


```text
                     CAD Application


                            │


                            ▼


                    Model Layer


                            │


                            ▼


                Persistence Interface


                            │


       ┌────────────────────┼────────────────────┐


       ▼                    ▼                    ▼


 Object Serializer   Transaction Log      Cache Manager


       │                    │                    │


       └────────────────────┼────────────────────┘


                            ▼


                    Storage Engine


                            │


       ┌────────────────────┼────────────────────┐


       ▼                    ▼                    ▼


 Project Database     Resources          Backup Archive
```

---

# 59. Save Data Flow


Complete save operation:


```text
User Save Command


        │


        ▼


Command System


        │


        ▼


Transaction Manager


        │


        ▼


Collect Changed Objects


        │


        ▼


Serialize Objects


        │


        ▼


Validate Data


        │


        ▼


Write Storage


        │


        ▼


Update Cache


        │


        ▼


Save Completed
```

---

# 60. Load Data Flow


```text
Open Project


       │


       ▼


Storage Engine


       │


       ▼


Read Project Metadata


       │


       ▼


Check Version


       │


       ▼


Run Migration


       │


       ▼


Deserialize Objects


       │


       ▼


Resolve References


       │


       ▼


Restore Model


       │


       ▼


Application Ready
```

---

# 61. Transaction Data Flow


```text
Operation Start


       │


       ▼


Create Transaction


       │


       ▼


Record Changes


       │


       ▼


Validate Operation


       │


       ├───────────────┐


       ▼               ▼


   Commit          Rollback


       │               │


       ▼               ▼


 Persist Data    Restore State
```

---

# 62. Implementation Checklist


## Storage Engine

- [ ] Storage Interface
- [ ] Local Storage Provider
- [ ] Binary Resource Store
- [ ] Database Store
- [ ] Compression System
- [ ] Integrity Validation


---

## Project File System

- [ ] Project Container
- [ ] Metadata Storage
- [ ] Resource Management
- [ ] Version Information
- [ ] Checksum System


---

## Serialization

- [ ] Object Serializer
- [ ] Object IDs
- [ ] Type Registry
- [ ] Reference Resolver
- [ ] Custom Data Support


---

## Transaction System

- [ ] Transaction Manager
- [ ] Commit System
- [ ] Rollback System
- [ ] Transaction Log
- [ ] Atomic Operations


---

## Undo / Redo Persistence

- [ ] History Integration
- [ ] Persistent Command Log
- [ ] State Restoration
- [ ] Replay Mechanism


---

## Cache System

- [ ] Memory Cache
- [ ] Disk Cache
- [ ] Geometry Cache
- [ ] Analysis Cache
- [ ] Cache Invalidation


---

## Migration

- [ ] Schema Versioning
- [ ] Migration Manager
- [ ] Migration Steps
- [ ] Validation System
- [ ] Legacy Support


---

## Backup & Recovery

- [ ] Auto Save
- [ ] Snapshot System
- [ ] Recovery Manager
- [ ] Crash Recovery
- [ ] Backup Rotation


---

## Cloud Foundation

- [ ] Sync Interface
- [ ] Version Comparison
- [ ] Conflict Detection
- [ ] Remote Storage Adapter


---

# 63. Acceptance Criteria


The Persistence System SHALL be accepted when:


- [ ] Projects can be saved reliably.
- [ ] Projects can be reopened correctly.
- [ ] Object references are restored.
- [ ] Failed operations can rollback.
- [ ] Undo/Redo survives sessions.
- [ ] Old project versions can migrate.
- [ ] Corrupted files can recover.
- [ ] Large assemblies load efficiently.


---

# 64. Quality Attributes


| Attribute | Rating | Description |
|-----------|:------:|-------------|
| Reliability | 5 | Safe data storage |
| Performance | 5 | Optimized loading |
| Compatibility | 5 | Version migration |
| Scalability | 5 | Large CAD projects |
| Recovery | 5 | Failure protection |
| Maintainability | 5 | Layer separation |


---

# 65. Open Questions


- [ ] Should project files support encryption?
- [ ] Should cloud sync be enabled by default?
- [ ] Should distributed collaboration be supported?
- [ ] Should database engine be replaceable?
- [ ] Should external backup providers be supported?


---

# 66. Revision History


| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial Database & Persistence architecture |


---

# 67. Decision Summary


TamerCAD SHALL implement a hybrid persistence architecture.


Final architecture:


```text
                 CAD Model


                    │


                    ▼


             Persistence API


                    │


       ┌────────────┼────────────┐


       ▼            ▼            ▼


 Serializer   Transaction   Cache


       │            │            │


       └────────────┼────────────┘


                    ▼


             Storage Engine


                    │


       ┌────────────┼────────────┐


       ▼            ▼            ▼


 Database     Resources     Backup
```


The Persistence System SHALL provide:


- Reliable project storage.
- Version compatibility.
- Transaction safety.
- Recovery capability.
- Future cloud integration.


---

# 68. Approval


Approved By:

Project Founder

Pardus26


Architecture Assistant

ChatGPT


Approval Date:

2026-07-31


Document Status:

Accepted