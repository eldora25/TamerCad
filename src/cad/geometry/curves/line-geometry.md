# Line Geometry


## 1. Purpose


The Line Geometry System defines
the fundamental linear curve
primitive in TamerCAD.


Lines provide the base geometry
for:


- Sketch entities.
- Profiles.
- Edges.
- Construction geometry.
- Feature paths.


---

# 2. Architecture Role


Line Geometry extends the
Curve System.


```text
             Curve System


                  │


                  ▼


            Line Geometry


                  │


       ┌──────────┼──────────┐


       ▼          ▼          ▼


   Sketch     Topology    Features
```

---

# 3. Design Goals


The Line Geometry System SHALL
provide:


```
Line Features


├── Infinite Line Model

├── Finite Segment Model

├── Point Evaluation

├── Direction Calculation

├── Distance Operations

├── Intersection

└── Transformation
```

---

# 4. Line Concept


A line represents a straight
path between two points or along
a direction vector.


```text
Line


{


startPoint,


endPoint,


direction,


length


}
```

---

# 5. Mathematical Definition


A line is represented as:


```text
L(t) = P0 + tD
```


Where:


```text
P0 = origin point


D = direction vector


t = parameter
```

---

# 6. Line Interface


```text
interface ILine
{


start();


end();


direction();


length();


evaluate(t);


closestPoint(point);


}
```

---

# 7. Line Types


Supported models:


```
Line Types


├── Infinite Line

├── Line Segment

├── Construction Line

└── Axis Line
```

---

# 8. Line Segment


The most common CAD line form.


```text
A ●────────────● B


Start          End
```

---

# 9. Segment Properties


A segment contains:


```
Properties


├── Start Point

├── End Point

├── Length

├── Direction

└── Bounding Box
```

---

# 10. Direction Vector


Direction is calculated:


```text
D = End - Start
```

Normalized:


```text
D = D / |D|
```

---

# 11. Length Calculation


Segment length:


```text
Length = Distance(Start,End)
```

---

# 12. Point Evaluation


The system calculates points
along the line.


Example:


```text
t = 0


Start Point


t = 1


End Point
```

---

# 13. Closest Point Calculation


The engine finds the nearest
location on a line.


```text
Input:


External Point


      │


      ▼


Projection


      │


      ▼


Closest Point
```

---

# 14. Line Intersection


Supported intersections:


```
Intersection


├── Line × Line

├── Line × Plane

├── Line × Curve

└── Line × Surface
```

---

# 15. Parallel Detection


Lines are parallel when:


```text
D1 × D2 = 0
```

---

# 16. Perpendicular Detection


Lines are perpendicular when:


```text
D1 · D2 = 0
```

---

# 17. Offset Line


The system supports creating
parallel copies.


```text
Original Line


────────────


Offset


────────────
```

---

# 18. Transformation


Lines support:


```
Transformations


├── Translation

├── Rotation

├── Scaling

└── Mirror
```

---

# 19. Topology Integration


Lines become topology edges.


```text
Line


 │


 ▼


Edge


 │


 ▼


Wire
```

---

# 20. Validation


Line validation checks:


```
Validation


├── Zero Length

├── Invalid Points

├── Invalid Direction

└── Numerical Errors
```

---

# 21. Events


Line changes generate:


```text
Events


LineCreated


LineModified


LineTransformed


LineDeleted
```

---

# 22. Performance Requirements


The system SHALL:


- Use lightweight representation.
- Support fast evaluation.
- Cache computed properties.
- Avoid redundant calculations.


---

# 23. Testing Requirements


Tests SHALL verify:


```
Line Tests


├── Creation

├── Direction

├── Length

├── Evaluation

├── Intersection

├── Offset

└── Transformation
```

---

# 24. Acceptance Criteria


- [ ] Line primitive implemented.
- [ ] Segment model defined.
- [ ] Direction calculation ready.
- [ ] Intersection API prepared.
- [ ] Topology connection defined.
- [ ] Transformation supported.


---

Status:

IMPLEMENTATION READY