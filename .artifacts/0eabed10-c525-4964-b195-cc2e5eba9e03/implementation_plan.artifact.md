# TAMERCAD CAD DEVELOPMENT — STEP 9 — 3D MANIPULATOR

This plan implements a professional 3D manipulation system for TamerCAD, moving beyond simple screen-offset dragging to true world-space ray-casting interactions. This system will allow for precise translation, rotation, and feature-specific manipulation (like Extrude depth) using the stylus.

## User Review Required

> [!IMPORTANT]
> **Ray-Casting Precision**: Movement will be calculated by intersecting a ray from the camera with 3D axes or planes. This ensures that the distance moved in the viewport corresponds exactly to the physical world units (mm).
> **Interactive Preview**: Geometry will update in real-time as the user drags a manipulator handle. The operation will only be committed to the command history upon release and confirmation.
> **Gizmo Visuals**: The manipulator (Gizmo) will include translation arrows (X, Y, Z), planar movement squares (XY, XZ, YZ), and rotation rings.

## Proposed Changes

### 1. Advanced 3D Intersection Engine
- **[MODIFY] core/math/Vector3.kt & Matrix4.kt**:
    - Add helper functions for Ray-Plane and Ray-Line (Axis) intersection.
- **[MODIFY] ui/CADViewModel.kt**:
    - Implement `getRayFromScreen(Offset)`: Generates a 3D ray starting at the camera position passing through the touch point.
    - Implement `calculateManipulationDelta(ray, axis/plane)`: Returns the 3D translation or rotation value based on intersection.

### 2. High-Fidelity 3D Manipulator (Gizmo)
- **[MODIFY] ui/viewport/Manipulator3D.kt**:
    - Expand `drawTranslationGizmo` to include small squares for **Planar Movement**.
    - Implement `drawRotationGizmo` with circular handles for each axis.
    - Add states for `hoveredHandle` and `activeHandle`.
    - Render numeric tooltips near the active handle during drag (e.g., `ΔZ: +15.50 mm`).

### 3. Interaction Pipeline Integration
- **[MODIFY] ui/CADViewModel.kt**:
    - Manage `activeManipulatorAxis` and `manipulationStartPoint`.
    - In `onSketchDrag`, if in `MANIPULATING` state, calculate the 3D delta and apply it to the selected `Component3D` or `IFeature`.
    - Support "Cancel" (reset to original transform) and "Confirm" (commit `MoveCommand` or `RotateCommand`).

### 4. Selection Integration
- The manipulator will automatically appear at the **Centroid** of the current selection (Body, Face, or Edge).

## Roadmap

1.  **Math Foundation**: Ray-casting and intersection algorithms.
2.  **Gizmo Visuals**: Implementation of planar and rotation handles.
3.  **Interaction State**: Routing stylus events to the manipulation engine.
4.  **Live Modeling**: Connecting manipulators to `ExtrudeFeature` and `MoveCommand`.

## Verification Plan

### Automated Tests
- Unit tests for Ray-Plane intersection accuracy.
- Unit tests for Ray-Axis closest point calculation.

### Manual Verification
- **Translation**: Drag the Red (X) arrow; verify the body moves only on the X axis and the numeric label matches the distance.
- **Rotation**: Drag a rotation ring; verify the body rotates around its center.
- **Extrude**: Select a face; drag its normal arrow; verify the `ExtrudeFeature` depth updates correctly.
- **Undo**: After a move, tap Undo and verify the body snaps back to its previous position.
