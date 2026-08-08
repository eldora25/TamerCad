# TamerCAD: Phase 2 Layout & Phase 3 Deep Modeling

This plan focuses on finalizing the professional layout orchestration and implementing the core of "Direct Modeling" — the ability to select individual faces and manipulate them using 3D Gizmos.

## User Review Required

> [!IMPORTANT]
> **Face Selection Logic**: We will implement a depth-sorting Ray-Casting algorithm. Tapping an object once will select the body; tapping a specific face of that body while the body is selected will switch selection to that face.
> **Dynamic Rebuild**: Dragging the Gizmo on a face will update the underlying Feature parameters (like Extrude Distance) in real-time, providing immediate visual feedback.

## Proposed Changes

### 1. Layout Orchestration (Phase 2)
- **[MODIFY] ui/app/CadScreen.kt**:
    - Finalize the layout with strictly defined floating areas.
    - Connect all components (`CADTopBar`, `CADSideToolbar`, `CADContextToolbar`, `CADViewport`) to the central `CADViewModel`.
    - Handle safe area insets (status bars, navigation bars) correctly for tablet screens.

### 2. High-Precision Face Picking (Phase 3 Deepening)
- **[MODIFY] ui/CADViewModel.kt**:
    - Update `pick3DEntity` to return a `Triple<IGeometry, Face3D?, Double>` representing the hit entity, specific face (if applicable), and distance.
    - Implement a "Selection Drill-Down" state: `Body` -> `Face/Edge`.
- **[MODIFY] ui/selection/SelectionManager.kt**:
    - Add support for selecting `Face3D` objects as sub-entities.

### 3. Face-Aligned 3D Gizmos
- **[MODIFY] ui/viewport/Manipulator3D.kt**:
    - Add `drawFaceManipulator`: Draws a single arrow aligned with the face normal.
    - Improve hit-testing to work with arbitrary 3D orientations.
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Calculate the centroid of the selected face to position the Gizmo accurately.

### 4. Direct Modeling Engine
- **[MODIFY] ui/CADViewModel.kt**:
    - In `onSketchDrag`, detect if a face-aligned manipulator is active.
    - Project the 2D drag amount onto the 3D normal vector of the face.
    - Update the corresponding `IFeature` (e.g., `ExtrudeFeature.distance`).
    - Trigger `feature.evaluate()` and `viewModel.triggerUpdate()`.

## Verification Plan

### Automated Tests
- Test Ray-Polygon intersection math with various orientations.
- Verify `SelectionManager` correctly handles sub-entity selection states.

### Manual Verification
- **Layout**: Open app in landscape; ensure no UI overlap and maximize viewport.
- **Selection**: Tap a cylinder; entire body highlights. Tap the top cap; only the top face highlights and an arrow appears.
- **Modeling**: Drag the arrow on the top face; the cylinder height should change dynamically.
