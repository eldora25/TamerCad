# Entity System


## 1. Purpose


The Entity System defines the
global management layer for all
CAD objects inside TamerCAD.


It provides:


- Unique object identity.
- Entity lifecycle management.
- Object registration.
- Entity lookup.
- State tracking.
- Metadata management.


---

# 2. Architecture Role


The Entity System connects
geometry objects with the
document and runtime layers.


```text
                 Application


                      │


                      ▼


               Document System


                      │


                      ▼


                Entity System


                      │


        ┌─────────────┼─────────────┐


        ▼             ▼             ▼


   Geometry       Features       Assemblies
```

---

# 3. Design Goals


The Entity System SHALL provide:


```
Entity Management


├── Unique Identity

├── Creation

├── Registration

├── Lookup

├── Modification Tracking

├── Deletion

└── Serialization
```

---

# 4. Entity Concept


Every CAD object is an Entity.


```text
Entity


{


id,


type,


state,


properties,


metadata


}
```

---

# 5. Entity Hierarchy


```text
Entity


    │


    ├── Geometry Entity


    │


    ├── Feature Entity


    │


    ├── Assembly Entity


    │


    ├── Material Entity


    │


    └── Analysis Entity
```

---

# 6. Entity Identifier System


Every entity SHALL have a
globally unique identifier.


```text
Entity ID


{


UUID,


type,


creationIndex


}
```

---

# 7. Entity ID Requirements


Identifiers SHALL:


```
ID Rules


├── Be Unique

├── Be Persistent

├── Survive Save/Load

├── Support References

└── Allow Fast Lookup
```

---

# 8. Entity Registry


The registry stores all active
entities.


```text
Entity Registry


        │


        ▼


ID → Entity Map


        │


        ▼


Runtime Access
```

---

# 9. Registry Operations


```text
Entity Registry


├── Register

├── Find

├── Remove

├── Update

└── Enumerate
```

---

# 10. Entity Lifecycle


Entities follow a controlled
lifecycle.


```text
Created


  │


  ▼


Registered


  │


  ▼


Active


  │


  ▼


Modified


  │


  ▼


Archived


  │


  ▼


Deleted
```

---

# 11. Entity States


```text
enum EntityState


{


CREATED,


ACTIVE,


MODIFIED,


LOCKED,


DELETED


}
```

---

# 12. Entity Creation


Creation process:


```text
Create Request


       │


       ▼


Entity Factory


       │


       ▼


Entity Instance


       │


       ▼


Registry Registration
```

---

# 13. Entity Factory


Factories create entities
without exposing implementation.


```text
interface IEntityFactory
{


create(type);


clone(entity);


destroy(entity);


}
```

---

# 14. Entity Lookup


Entities SHALL be accessible
through:


```
Lookup Methods


├── ID Search

├── Type Search

├── Spatial Search

└── Property Search
```

---

# 15. Entity Relationships


Entities may reference
other entities.


```text
Assembly


   │


   ▼


Component Entity


   │


   ▼


Geometry Entity
```

---

# 16. Reference Management


References SHALL be tracked.


```text
Entity A


   │


   ▼


Reference


   │


   ▼


Entity B
```

---

# 17. Dependency Tracking


The system SHALL know which
objects depend on others.


Example:


```text
Feature


   │


   ▼


Sketch


   │


   ▼


Geometry
```

---

# 18. Modification Tracking


Changes SHALL be recorded.


```text
Entity Change


        │


        ▼


Change Manager


        │


        ▼


History System
```

---

# 19. Metadata System


Entities support metadata.


```text
Metadata


├── Name

├── Description

├── Layer

├── Visibility

├── Color

└── User Properties
```

---

# 20. Visibility Management


Entities SHALL support display
state control.


```text
Visibility


├── Visible

├── Hidden

├── Suppressed

└── Temporary
```

---

# 21. Entity Locking


Entities may be locked
during operations.


```text
Operation


   │


   ▼


Lock Entity


   │


   ▼


Modify


   │


   ▼


Unlock
```

---

# 22. Serialization


Entities SHALL support
persistent storage.


```text
Entity


   │


   ▼


Serializer


   │


   ▼


Document File
```

---

# 23. Entity Events


Entity changes publish events.


Examples:


```text
Events


EntityCreated


EntityModified


EntityDeleted


EntitySelected
```

---

# 24. Performance Considerations


Entity System SHALL:


- Use indexed lookup.
- Minimize object duplication.
- Support lazy loading.
- Optimize memory usage.


---

# 25. Testing Requirements


Tests SHALL verify:


```
Entity Tests


├── Creation

├── Registration

├── Lookup

├── Modification

├── Serialization

└── Deletion
```

---

# 26. Acceptance Criteria


- [ ] Entity model defined.
- [ ] Unique ID system exists.
- [ ] Registry works.
- [ ] Lifecycle states defined.
- [ ] Metadata supported.
- [ ] Serialization prepared.
- [ ] Runtime integration ready.


---

Status:

IMPLEMENTATION READY