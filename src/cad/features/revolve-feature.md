# Revolve Feature


## 1. Purpose


The Revolve Feature defines the
parametric rotational solid
creation operation in TamerCAD.


It creates three-dimensional
geometry by rotating a 2D profile
around a defined axis.


Applications include:


- Rotational mechanical parts.
- Shafts.
- Wheels.
- Bearings.
- Cylindrical components.
- Symmetric manufacturing parts.


---

# 2. Architecture Role


The Revolve Feature extends the
Feature Kernel and works with
geometry and topology systems.


```text
             Feature Kernel


                    │


                    ▼


            Revolve Feature


                    │


       ┌────────────┼────────────┐


       ▼            ▼            ▼


    Sketch        Solid        BRep
```

---

# 3. Design Goals


The Revolve System SHALL provide:


```
Revolve Features


├── Profile Input

├── Axis Definition

├── Angle Control

├── Direction Control

├── Solid Generation

├── Validation

└── History Integration
```

---

# 4. Revolve Concept


Revolve creates geometry by
rotating a profile around an axis.


```text
Profile


    │


    ▼


Rotation


    │


    ▼


Solid
```

---

# 5. Feature Definition


```text
RevolveFeature


{


profile,


axis,


angle,


direction,


operationType,


result


}
```

---

# 6. Feature Interface


```text
interface IRevolveFeature
{


profile();


axis();


angle();


execute();


result();


validate();


}
```

---

# 7. Input Profile


The feature requires a valid
closed profile.


Supported inputs:


```
Profiles


├── Sketch Loop

├── Circle

├── Rectangle

├── Polygon

└── Composite Curve
```

---

# 8. Axis System


The rotation axis defines the
center of transformation.


```text
Axis


{


origin,


direction


}
```

---

# 9. Axis Sources


Supported axis references:


```
Axis Types


├── Sketch Axis

├── Construction Line

├── Reference Axis

├── Edge Axis

└── Custom Vector
```

---

# 10. Rotation Angle


The angle defines the amount
of rotation.


```text
Angle


0° ─────────────► 360°
```

---

# 11. Full Revolution


A complete rotation creates a
closed rotational body.


```text
360°


Profile


    │


    ▼


Revolved Solid
```

---

# 12. Partial Revolution


The system supports incomplete
rotations.


Examples:


```
Angles


45°


90°


180°


270°
```

---

# 13. Direction Control


Rotation direction:


```
Direction


├── Positive

├── Negative

└── Two Direction
```

---

# 14. Geometry Generation


Pipeline:


```text
Sketch


 │


 ▼


Profile Validation


 │


 ▼


Axis Resolution


 │


 ▼


Rotational Sweep


 │


▼


Solid Generation
```

---

# 15. Surface Creation


Rotation generates:


```
Generated Geometry


├── Revolved Surface

├── Side Faces

├── End Faces

└── Solid Body
```

---

# 16. Topology Creation


Generated topology:


```text
Profile Edges


        │


        ▼


Rotated Edges


        │


        ▼


Faces


        │


        ▼


Solid
```

---

# 17. Operation Modes


Supported operations:


```
Modes


├── Create Body

├── Add Material

├── Remove Material

└── Intersect Body
```

---

# 18. Parameter Update


Changing parameters triggers:


```text
Angle Change


       │


       ▼


Feature Rebuild


       │


       ▼


Updated Geometry
```

---

# 19. Dependency System


Revolve depends on:


```
Dependencies


├── Profile

├── Axis

├── Angle

├── Reference Geometry

└── Parameters
```

---

# 20. Validation


Checks include:


```
Validation


├── Missing Profile

├── Invalid Axis

├── Zero Angle

├── Self Intersection

├── Invalid Solid

└── Failed Rebuild
```

---

# 21. Boolean Integration


Revolve output supports:


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


RevolveCreated


RevolveUpdated


RevolveRebuilt


RevolveFailed
```

---

# 23. Performance Requirements


The system SHALL:


- Cache rotational calculations.
- Reuse profile geometry.
- Optimize full revolutions.
- Support complex sketches.


---

# 24. Testing Requirements


Tests SHALL verify:


```
Revolve Tests


├── Profile

├── Axis

├── Angle

├── Direction

├── Solid Result

├── Rebuild

└── Validation
```

---

# 25. Acceptance Criteria


- [ ] Revolve feature defined.
- [ ] Axis system prepared.
- [ ] Rotation engine connected.
- [ ] Solid generation ready.
- [ ] History integration supported.
- [ ] Validation implemented.


---

Status:

IMPLEMENTATION READY