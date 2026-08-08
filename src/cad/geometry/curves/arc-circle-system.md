# Arc Circle System


## 1. Purpose


The Arc Circle System defines
circular geometry primitives in
TamerCAD.


It provides mathematical support
for:


- Full circles.
- Circular arcs.
- Radial calculations.
- Circular intersections.
- Sketch operations.


---

# 2. Architecture Role


The Arc Circle System extends
the Curve System.


```text
              Curve System


                    │


                    ▼


          Arc Circle System


                    │


        ┌───────────┼───────────┐


        ▼           ▼           ▼


     Circle       Arc       Features
```

---

# 3. Design Goals


The system SHALL provide:


```
Circle Features


├── Center Radius Model

├── Plane Definition

├── Point Evaluation

├── Arc Parameterization

├── Tangent Calculation

├── Intersection

└── Transformation
```

---

# 4. Circle Concept


A circle represents a closed
curve with constant radius.


```text
Circle


{


center,


radius,


normal,


plane


}
```

---

# 5. Mathematical Definition


Circle equation:


```text
(x-a)² + (y-b)² = r²
```


Where:


```text
(a,b)


Center


r


Radius
```

---

# 6. 3D Circle Representation


In 3D space:


```text
Circle


{


center point,


normal vector,


radius,


coordinate system


}
```

---

# 7. Circle Interface


```text
interface ICircle
{


center();


radius();


normal();


evaluate(angle);


circumference();


}
```

---

# 8. Circle Properties


A circle contains:


```
Properties


├── Center

├── Radius

├── Diameter

├── Normal

├── Plane

└── Bounding Box
```

---

# 9. Radius Validation


Radius SHALL satisfy:


```text
radius > tolerance
```

Invalid:


```text
radius = 0
```

---

# 10. Point Evaluation


Points on a circle are
generated using angle.


```text
P(θ)


θ = angle parameter
```

---

# 11. Arc Concept


An arc is a portion of a
circle.


```text
Arc


{


circle reference,


start angle,


end angle


}
```

---

# 12. Arc Types


Supported arcs:


```
Arc Types


├── Minor Arc

├── Major Arc

├── Three Point Arc

├── Center Radius Arc

└── Tangent Arc
```

---

# 13. Arc Parameterization


Arc evaluation:


```text
θ0 ≤ θ ≤ θ1
```

---

# 14. Arc Length


Circular arc length:


```text
Length = r × θ
```

Where:


```text
r = radius


θ = angle difference
```

---

# 15. Tangent Calculation


The system calculates
direction along the curve.


```text
Radius Vector


       │


       ▼


Perpendicular


       │


       ▼


Tangent
```

---

# 16. Circle Intersection


Supported:


```
Intersection


├── Circle × Circle

├── Circle × Line

├── Circle × Plane

└── Circle × Curve
```

---

# 17. Arc Intersection


Arc intersections include
range validation.


```text
Circle Intersection


        │


        ▼


Angle Check


        │


        ▼


Arc Result
```

---

# 18. Offset Circle


The system supports:


```text
Original Radius


        r


Offset


        r + d
```

---

# 19. Transformation


Circular geometry supports:


```
Transformations


├── Translation

├── Rotation

├── Scaling

└── Mirror
```

---

# 20. Topology Integration


Circular geometry becomes
topological edges.


```text
Circle / Arc


      │


      ▼


Edge


      │


      ▼


Wire
```

---

# 21. Validation


Checks:


```
Validation


├── Invalid Radius

├── Invalid Plane

├── Broken Arc Range

├── Numerical Errors

└── Self Intersection
```

---

# 22. Events


Generated events:


```text
Events


CircleCreated


ArcCreated


CircleModified


ArcDeleted
```

---

# 23. Performance Requirements


The system SHALL:


- Cache trigonometric calculations.
- Support fast evaluation.
- Avoid unnecessary recalculation.
- Handle large sketch datasets.


---

# 24. Testing Requirements


Tests SHALL verify:


```
Circle Tests


├── Creation

├── Radius

├── Evaluation

├── Length

├── Intersection

├── Transform

└── Validation
```

---

# 25. Acceptance Criteria


- [ ] Circle model defined.
- [ ] Arc model defined.
- [ ] Parameter evaluation ready.
- [ ] Circular intersection prepared.
- [ ] Topology integration defined.
- [ ] CAD sketch support ready.


---

Status:

IMPLEMENTATION READY