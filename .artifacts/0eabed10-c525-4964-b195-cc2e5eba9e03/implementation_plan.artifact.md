# TamerCAD: Phase 3 - Precision Selection Engine & 3D Manipulators

This plan introduces a high-precision selection system and interactive 3D manipulators (Gizmos) to TamerCad. These features will allow users to select specific geometric entities (Vertices, Edges, Faces, Bodies) and manipulate them directly in 3D space using stylus-driven handles.

## User Review Required

> [!IMPORTANT]
> **Selection Hierarchy:** Selection will follow a "drill-down" logic. First tap selects the Body, second tap on the same area selects the Face or Edge.
> **Manipulator Behavior:** Manipulators (arrows/rings) will appear at the center of the selected entity. Dragging a manipulator will restrict movement to that specific axis or plane.

## Proposed Changes

### 1. Unified Selection Manager
- **[NEW] ui/selection/SelectionManager.kt**:
    - Manage current selection set (single or multiple).
    - Handle selection filters (enable/disable specific entity types).
    - Dispatch selection change events to update the UI (ContextToolbar).

### 2. Ray-Casting & 3D Picking
- **[MODIFY] ui/CADViewModel.kt**:
    - Implement `pick3DEntity(screenOffset)`:
        - Generate a ray from the camera through the touch point.
        - Intersect with all visible `Face3D` and `Line` entities in the assembly.
        - Sort by Z-depth and return the closest hit.
    - Update `onTap` to utilize this new picking logic.

### 3. Interactive 3D Manipulators (Gizmos)
- **[NEW] ui/viewport/Manipulator3D.kt**:
    - Component to render 3D handles (Translation Arrows: X-Red, Y-Green, Z-Blue).
    - Handle "hover" and "active" states for manipulators.
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Render manipulators on top of the 3D model if an entity is selected.
    - Detect hits on manipulator handles before detecting hits on geometry.

### 4. Direct Manipulation Logic
- **[MODIFY] ui/CADViewModel.kt**:
    - Add state for `activeManipulatorAxis` (X, Y, Z, or NONE).
    - Update `onSketchDrag` to handle translation or feature parameter changes (e.g., Extrude Distance) when a manipulator is being dragged.

## Roadmap

1.  **Selection Refactor:** Migrate current selection state to `SelectionManager`.
2.  **3D Picking:** Implement ray-face intersection for assembly components.
3.  **Manipulator Rendering:** Draw translation arrows at the center of selected faces/bodies.
4.  **Interaction:** Connect manipulator dragging to `Component3D` transform or `IFeature` parameters.

## Verification Plan

### Automated Tests
- Unit tests for Ray-Plane intersection.
- Unit tests for `SelectionManager` state transitions.

### Manual Verification
- Deploy APK and verify that tapping a 3D body highlights it.
- Verify that dragging the blue arrow on a selected face changes its position or extrude height.
- Verify that selection filters in the UI correctly restrict what can be picked.
