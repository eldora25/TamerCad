# Curve System


## 1. Purpose


The Curve System defines the
mathematical framework for
one-dimensional geometry in
TamerCAD.


It provides the foundation for:


- Sketch entities.
- Wire geometry.
- Surface boundaries.
- Feature paths.
- Parametric modeling.


---

# 2. Architecture Role


The Curve System extends the
Point System and provides the
base layer for advanced geometry.


```text
              Geometry Engine


                     │


                     ▼


              Curve System


                     │


      ┌──────────────┼──────────────┐


      ▼              ▼              ▼


   Lines          Arcs          Splines
```

---

# 3. Design Goals


The Curve System SHALL provide:


```
Curve Features


├── Parametric Definition

├── Evaluation

├── Tangent Calculation

├── Length Measurement

├── Intersection

├── Transformation

└── Validation
```

---

# 4. Curve Concept


A curve represents a continuous
path in coordinate space.


```text
Curve


{


id,


type,


parameters,


domain,


controlData


}
```

---

# 5. Parametric Representation


Curves are evaluated using a
parameter value.


```text
C(t)


where:


t = parameter
```

---

# 6. Curve Interface


```text
interface ICurve
{


evaluate(t);


derivative(t);


length();


transform(matrix);


intersect(curve);


}
```

---

# 7. Curve Types


Supported curve families:


```
Curves


├── Line

├── Circle

├── Arc

├── Polyline

├── Bezier

├── NURBS

└── Spline
```

---

# 8. Curve Evaluation


A curve can return a point
at a parameter position.


Example:


```text
Input:


t = 0.5


Output:


Point(x,y,z)
```

---

# 9. Tangent Calculation


Curves provide directional
information.


```text
Curve


   │


   ▼


Derivative


   │


   ▼


Tangent Vector
```

---

# 10. Normal Calculation


Some curves support normal
vectors.


```text
Normal


Perpendicular Direction


of Curve
```

---

# 11. Curve Length


The system calculates curve
distance.


```text
Length


    │


    ▼


Numerical Integration


    │


    ▼


Distance Value
```

---

# 12. Curve Domain


Each curve defines a valid
parameter range.


```text
Domain:


[t0 , t1]
```

---

# 13. Curve Transformation


Supported transformations:


```
Transform


├── Translate

├── Rotate

├── Scale

└── Mirror
```

---

# 14. Curve Intersection


The engine supports:


```
Intersection


├── Curve × Curve

├── Curve × Line

├── Curve × Surface

└── Curve × Solid
```

---

# 15. Curve Projection


Curves may be projected onto
other geometry.


Examples:


```
Projection


Curve → Plane


Curve → Surface
```

---

# 16. Curve Sampling


Curves can generate discrete
points.


```text
Curve


    │


    ▼


Sampler


    │


    ▼


Point List
```

---

# 17. Curve Validation


Validation checks:


```
Validation


├── Invalid Parameters

├── Broken Domain

├── Discontinuity

├── Self Intersection

└── Numerical Errors
```

---

# 18. Curve Topology Integration


Curves connect with topology.


```text
Curve


 │


 ▼


Edge


 │


 ▼


Wire


 │


 ▼


Face Boundary
```

---

# 19. Curve Events


Curve modifications publish:


```text
Events


CurveCreated


CurveUpdated


CurveTransformed


CurveDeleted
```

---

# 20. Performance Requirements


The system SHALL:


- Cache evaluations.
- Support fast sampling.
- Optimize repeated calculations.
- Handle complex curves efficiently.


---

# 21. Testing Requirements


Tests SHALL verify:


```
Curve Tests


├── Creation

├── Evaluation

├── Derivative

├── Length

├── Intersection

├── Transform

└── Validation
```

---

# 22. Future Extensions


Prepared for:


```
Advanced Curves


├── Rational Curves

├── NURBS Refinement

├── Offset Curves

├── Curve Fitting

└── AI Assisted Geometry
```

---

# 23. Acceptance Criteria


- [ ] Curve abstraction defined.
- [ ] Parametric model prepared.
- [ ] Evaluation API exists.
- [ ] Length calculation defined.
- [ ] Intersection support prepared.
- [ ] Topology integration ready.


---

Status:

IMPLEMENTATION READY