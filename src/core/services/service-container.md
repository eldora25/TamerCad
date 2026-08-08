# Service Container


## 1. Purpose


The Service Container is the central
dependency management system of TamerCAD.


It provides:


- Service registration.
- Dependency resolution.
- Lifecycle management.
- Service isolation.
- Runtime access.


---

# 2. Architecture Role


The Service Container connects
all core services.


```text
                 Application Runtime


                         │


                         ▼


                Service Container


                         │


 ┌───────────────────────┼───────────────────────┐


 ▼                       ▼                       ▼


Geometry Service   Database Service      Plugin Service


 ▼                       ▼                       ▼


Core Modules       Infrastructure       Extensions
```

---

# 3. Design Goals


The Service Container SHALL provide:


```
Service Management


├── Register Services

├── Resolve Dependencies

├── Control Lifetime

├── Manage Instances

├── Validate Services

└── Release Resources
```

---

# 4. Service Lifecycle


Every service SHALL follow
a controlled lifecycle.


```text
Created


  │


  ▼


Registered


  │


  ▼


Initialized


  │


  ▼


Active


  │


  ▼


Stopping


  │


  ▼


Disposed
```

---

# 5. Service Registration


Services SHALL be registered
before application execution.


Example:


```text
Register Service


        │


        ▼


Service Interface


        │


        ▼


Service Implementation


        │


        ▼


Container Storage
```

---

# 6. Service Definition


A service SHALL contain:


```text
Service Definition


├── Identifier

├── Interface

├── Implementation

├── Lifetime

├── Dependencies

└── Configuration
```

---

# 7. Service Interface


```text
interface IService
{


    initialize();


    start();


    stop();


    dispose();


}
```

---

# 8. Service Container Interface


```text
interface IServiceContainer
{


    register();


    resolve();


    has();


    initializeAll();


    shutdownAll();


}
```

---

# 9. Dependency Resolution


Dependencies SHALL be resolved
automatically.


```text
Requested Service


        │


        ▼


Dependency Lookup


        │


        ▼


Dependency Graph


        │


        ▼


Instance Creation


        │


        ▼


Ready Service
```

---

# 10. Dependency Graph


Example:


```text
Application Runtime


          │


          ▼


 Service Container


          │


 ┌────────┼────────┐


 ▼        ▼        ▼


Database Logger Resource


          │


          ▼


Geometry Engine
```

---

# 11. Lifetime Management


Services SHALL support different
lifetimes.


```
Service Lifetime


├── Singleton

├── Scoped

└── Transient
```

---

# 12. Singleton Services


Singleton services have
one instance per runtime.


Examples:


```
Singleton


├── Logger

├── Configuration

├── Database Manager

└── Event Bus
```

---

# 13. Scoped Services


Scoped services live inside
a controlled scope.


Examples:


```
Scoped


├── Document Session

├── Command Context

└── Analysis Session
```

---

# 14. Transient Services


Transient services are created
when requested.


Examples:


```
Transient


├── Command Objects

├── Temporary Calculators

└── Validators
```

---

# 15. Initialization Order


Services SHALL initialize
according to dependency order.


```text
Configuration


      │


      ▼


Logger


      │


      ▼


Database


      │


      ▼


Geometry


      │


      ▼


Application Services
```

---

# 16. Circular Dependency Protection


The container SHALL detect
dependency loops.


```text
Service A


   │


   ▼


Service B


   │


   ▼


Service A


        ❌


Circular Dependency
```

---

# 17. Error Handling


Service failures SHALL be
reported centrally.


```text
Service Error


      │


      ▼


Container Error Handler


      │


      ▼


Recovery / Shutdown
```

---

# 18. Runtime Integration


Application Runtime uses
the container as the primary
service gateway.


```text
Application Runtime


          │


          ▼


Service Container


          │


          ▼


Core Services
```

---

# 19. Performance Considerations


The Service Container SHALL:


- Cache singleton instances.
- Avoid repeated resolution.
- Validate dependencies early.
- Support lazy loading.


---

# 20. Security Considerations


Services SHALL respect
security boundaries.


Examples:


```
Protected Services


├── File Access

├── Plugin Execution

├── Database Access

└── License Validation
```

---

# 21. Acceptance Criteria


- [ ] Services can register.
- [ ] Dependencies resolve correctly.
- [ ] Lifetimes are controlled.
- [ ] Circular dependencies are detected.
- [ ] Shutdown releases resources.
- [ ] Runtime integration works.


---

Status:

IMPLEMENTATION READY