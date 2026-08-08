# Sweep Feature


## 1. Purpose


The Sweep Feature defines the
parametric path-based geometry
creation system in TamerCAD.


It creates complex geometry by
moving a profile along a path.


Applications include:


- Pipes.
- Tubes.
- Rails.
- Handles.
- Complex mechanical parts.
- Routed manufacturing paths.


---

# 2. Architecture Role


The Sweep Feature extends the
Feature Kernel and integrates
curves, surfaces, and solids.


```text
             Feature Kernel


                    │


                    ▼


             Sweep Feature


                    │


       ┌────────────┼────────────┐


       ▼            ▼            ▼


    Profile       Path        Solid
```

---

# 3. Design Goals


The Sweep System SHALL provide:


```
Sweep Features


├── Profile Management

├── Path Management

├── Orientation Control

├── Twist Control

├── Solid Generation

├── Validation

└── History Integration
```

---

# 4. Sweep Concept


A sweep creates geometry by
moving a profile along a curve.


```text
Profile


    │


    ▼


Path Movement


    │


    ▼


Swept Geometry
```

---

# 5. Feature Definition


```text
SweepFeature


{


profile,


path,


orientation,


twist,


operationType,


result


}
```

---

# 6. Feature Interface


```text
interface ISweepFeature
{


profile();


path();


orientation();


twist();


execute();


result();


validate();


}
```

---

# 7. Profile System


The sweep profile defines the
cross-section.


Supported profiles:


```
Profiles


├── Sketch Loop

├── Circle

├── Rectangle

├── Polygon

├── Composite Curve

└── Custom Section
```

---

# 8. Path System


The path defines the movement
trajectory.


```text
Path


Curve


    │


    ▼


Sweep Direction
```

---

# 9. Path Types


Supported paths:


```
Paths


├── Line

├── Arc

├── Spline

├── Composite Curve

└── 3D Curve
```

---

# 10. Orientation Control


The profile orientation may
change along the path.


Modes:


```
Orientation


├── Fixed

├── Follow Path

├── Normal To Path

└── Reference Direction
```

---

# 11. Twist Control


The feature supports profile
rotation during sweeping.


```text
Twist


0°


│


▼


360°
```

---

# 12. Sweep Types


Supported modes:


```
Sweep Modes


├── Solid Sweep

├── Surface Sweep

├── Thin Sweep

└── Cut Sweep
```

---

# 13. Geometry Generation


Pipeline:


```text
Profile


 │


 ▼


Path Validation


 │


 ▼


Frame Calculation


 │


 ▼


Profile Transport


 │


 ▼


Surface Creation


 │


 ▼


Solid Generation
```

---

# 14. Frame Calculation


The system calculates local
coordinate frames.


```text
Path Point


    │


    ▼


Tangent


    │


    ▼


Profile Orientation
```

---

# 15. Sweep Surface Creation


Generated surfaces:


```
Geometry


├── Side Surface

├── Start Face

├── End Face

└── Solid Boundary
```

---

# 16. Topology Creation


Sweep generates BRep topology.


```text
Profile Edges


      │


      ▼


Swept Edges


      │


      ▼


Faces


      │


      ▼


Solid
```

---

# 17. Multi Section Sweep


The system prepares multiple
profile support.


```text
Profile A


    │


Profile B


    │


Profile C


    │


    ▼


Variable Sweep
```

---

# 18. Variable Sweep


Future support:


```
Variable Parameters


├── Scale

├── Rotation

├── Profile Change

└── Twist Variation
```

---

# 19. Dependency System


Sweep depends on:


```
Dependencies


├── Profile

├── Path

├── Orientation

├── References

└── Parameters
```

---

# 20. Validation


Checks include:


```
Validation


├── Missing Profile

├── Invalid Path

├── Self Intersection

├── Impossible Orientation

├── Failed Solid

└── Rebuild Error
```

---

# 21. Boolean Integration


Sweep output supports:


```
Boolean


├── Union

├── Difference

├── Intersection

└── Split
```

---

# 22. Event System


Generated events:


```text
Events


SweepCreated


SweepUpdated


SweepRebuilt


SweepFailed
```

---

# 23. Performance Requirements


The system SHALL:


- Optimize path sampling.
- Cache frame calculations.
- Support long complex paths.
- Minimize topology rebuilds.


---

# 24. Testing Requirements


Tests SHALL verify:


```
Sweep Tests


├── Profile

├── Path

├── Orientation

├── Twist

├── Solid Result

├── Rebuild

└── Validation
```

---

# 25. Acceptance Criteria


- [ ] Sweep feature defined.
- [ ] Profile system integrated.
- [ ] Path system prepared.
- [ ] Orientation engine ready.
- [ ] Solid generation supported.
- [ ] Feature history connected.


---

Status:

IMPLEMENTATION READY