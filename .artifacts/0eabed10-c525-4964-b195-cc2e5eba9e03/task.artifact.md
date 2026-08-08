# TamerCAD Phase 3 - Precision Selection & 3D Manipulators Progress

- [x] **Unified Selection Management**
    - [x] Create `ui/selection/SelectionManager.kt`
    - [x] Refactor `CADViewModel` to use `SelectionManager`
- [x] **3D Picking Engine (Ray-Casting Lite)**
    - [x] Implement Ray-Plane intersection (Point-in-Polygon) in `CADViewModel`
    - [x] Update `onTap` to support 3D body picking
- [x] **3D Manipulators (Gizmos)**
    - [x] Create `ui/viewport/Manipulator3D.kt`
    - [x] Implement rendering logic for translation arrows (X, Y, Z)
    - [x] Add hit-detection for manipulator handles
- [/] **Interaction & Direct Modeling**
    - [x] Update `onSketchDrag` to handle manipulator-constrained movement
    - [x] Connect manipulators to `Component3D` transforms
    - [ ] Connect manipulators to `ExtrudeFeature` parameters (Next)
- [ ] **Verification**
    - [x] APK Build successful
    - [ ] Manual test: Move body via Gizmo
