# TamerCAD Phase 3 Deepening - Edge Selection & Fillet/Chamfer Progress

- [x] **Edge Selection & Metadata**
    - [x] Add `parentFeatureId` to `Line.kt`
    - [x] Enhance `pick3DEntity` in `CADViewModel.kt` for Edge detection (25px tolerance)
- [x] **Fillet and Chamfer Features**
    - [x] Create `FilletFeature.kt`
    - [x] Create `ChamferFeature.kt`
- [x] **Edge-Specific 3D Manipulators**
    - [x] Implement `drawEdgeManipulator` in `Manipulator3D.kt` (Yellow handle)
    - [x] Update `hitTest` in `Manipulator3D.kt` for edge handles (`EDGE_OFFSET`)
    - [x] Render edge manipulators in `CADCanvas.kt`
- [x] **Direct Modeling for Edges**
    - [x] Implement edge drag logic in `CADViewModel.kt`
    - [x] Connect dragging to `FilletFeature` radius updates
- [x] **Verification**
    - [x] Build APK and verify layout and selection
