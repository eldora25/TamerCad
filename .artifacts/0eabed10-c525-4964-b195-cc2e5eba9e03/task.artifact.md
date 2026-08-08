# TamerCAD Phase 3 - Precision Selection & 3D Manipulators Task List

- [ ] **Unified Selection Management**
    - [ ] Create `ui/selection/SelectionManager.kt`
    - [ ] Refactor `CADViewModel` to use `SelectionManager`
- [ ] **3D Picking Engine (Ray-Casting)**
    - [ ] Implement Ray-Plane intersection in `CADViewModel`
    - [ ] Implement Ray-Edge (Line) proximity hit-testing
    - [ ] Update `onTap` to support deep picking (Body -> Face/Edge)
- [ ] **3D Manipulators (Gizmos)**
    - [ ] Create `ui/viewport/Manipulator3D.kt`
    - [ ] Implement rendering logic for translation arrows (X, Y, Z)
    - [ ] Add hit-detection for manipulator handles
- [ ] **Interaction & Direct Modeling**
    - [ ] Update `onSketchDrag` to handle manipulator-constrained movement
    - [ ] Connect manipulators to `Component3D` transforms and `ExtrudeFeature` parameters
- [ ] **Verification**
    - [ ] Build and test on tablet
    - [ ] Verify selection hierarchy logic
