# Dependency Injection System


## 1. Purpose


The Dependency Injection system
provides controlled dependency
creation and delivery inside
TamerCAD.


It separates:


- Object creation.
- Object usage.
- Service ownership.


---

# 2. Architecture Goal


Dependency Injection enables:


```
Loose Coupling

+

High Testability

+

Replaceable Components

+

Controlled Dependencies
```

---

# 3. Design Principle


Components SHALL depend on
interfaces instead of concrete
implementations.


```text
Incorrect:


Feature Engine


      │


      ▼


Concrete Geometry Engine
```


```text
Correct:


Feature Engine


      │


      ▼


IGeometry Service


      │


      ▼


Geometry Implementation
```

---

# 4. Dependency Injection Architecture


```text
                    Application


                         │


                         ▼


                Dependency Container


                         │


        ┌────────────────┼────────────────┐


        ▼                ▼                ▼


   Geometry API    Database API     Plugin API


        │                │                │


        ▼                ▼                ▼


 Geometry Impl     Database Impl    Plugin Impl
```

---

# 5. Injection Types


TamerCAD SHALL support:


```
Injection Methods


├── Constructor Injection

├── Property Injection

└── Method Injection
```

---

# 6. Constructor Injection


Primary injection method.


Example:


```text
FeatureManager


        │


        ▼


Constructor


        │


        ▼


IGeometryKernel
```

---

# 7. Property Injection


Used for optional dependencies.


```text
Component


      │


      ▼


Optional Service Property


      │


      ▼


Runtime Assignment
```

---

# 8. Method Injection


Used when dependency is required
only during specific operations.


```text
Operation


   │


   ▼


Inject Service


   │


   ▼


Execute Task
```

---

# 9. Dependency Registration


Dependencies SHALL be registered
during startup.


```text
Startup


  │


  ▼


Service Registration


  │


  ▼


Dependency Map


  │


  ▼


Runtime Resolution
```

---

# 10. Dependency Map


Example:


```text
Dependency Registry


ILogger


   │


   ▼


ConsoleLogger


IDatabase


   │


   ▼


CADDatabase


IGeometryKernel


   │


   ▼


GeometryKernel
```

---

# 11. Interface Based Design


Core interfaces:


```
Interfaces


├── ILogger

├── IDatabase

├── IGeometryKernel

├── ICommandManager

├── IPluginManager

└── IResourceManager
```

---

# 12. Resolution Process


When a component requests
a dependency:


```text
Request


 │


 ▼


Interface Lookup


 │


 ▼


Implementation Search


 │


 ▼


Instance Creation


 │


 ▼


Injection Complete
```

---

# 13. Lifetime Integration


Dependency Injection works with
service lifetimes.


```text
Dependency


      │


      ▼


Lifetime Manager


      │


 ┌────┼────┐


 ▼    ▼    ▼


Singleton Scoped Transient
```

---

# 14. Lazy Resolution


Heavy services SHALL support
lazy creation.


```text
Application Start


        │


        ▼


Register Service


        │


        ▼


Wait


        │


        ▼


First Request


        │


        ▼


Create Instance
```

---

# 15. Dependency Validation


Before runtime:


```
Validation


├── Missing Dependency Check

├── Circular Dependency Check

├── Lifetime Conflict Check

└── Interface Compatibility
```

---

# 16. Testing Support


Dependency Injection enables
mock implementations.


Example:


```text
Production:


Feature Engine


      │


      ▼


Real Geometry Kernel



Testing:


Feature Engine


      │


      ▼


Mock Geometry Kernel
```

---

# 17. Module Isolation


Modules SHALL not directly
create external services.


```text
Forbidden:


Module


 │


 ▼


new Service()


```


```text
Required:


Module


 │


 ▼


Injected Service
```

---

# 18. Runtime Integration


The runtime creates the
dependency graph.


```text
Application Runtime


          │


          ▼


Dependency Injection


          │


          ▼


Service Container


          │


          ▼


Active System
```

---

# 19. Error Handling


Dependency failures SHALL
provide clear diagnostics.


```text
Injection Error


       │


       ▼


Diagnostic Report


       │


       ▼


Startup Failure / Recovery
```

---

# 20. Performance Considerations


The system SHALL:


- Cache resolved singleton services.
- Avoid unnecessary allocations.
- Support lazy loading.
- Validate during startup.


---

# 21. Security Considerations


Sensitive services SHALL be
controlled by access policies.


Protected examples:


```
Secure Dependencies


├── File Manager

├── License Service

├── Plugin Loader

└── Database Access
```

---

# 22. Acceptance Criteria


- [ ] Dependencies resolve automatically.
- [ ] Interfaces are preferred.
- [ ] Services are replaceable.
- [ ] Tests can inject mocks.
- [ ] Circular dependencies are detected.
- [ ] Runtime startup validates graph.


---

Status:

IMPLEMENTATION READY