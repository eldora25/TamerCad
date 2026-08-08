# TAMERCAD CAD DEVELOPMENT — STEP 4 — SNAP AND INFERENCE ENGINE

This plan focuses on implementing a professional-grade snapping and inference system for TamerCAD. The system will allow users to accurately snap to key geometric features such as endpoints, midpoints, centers, intersections, and more, significantly improving the precision of the stylus-based sketching experience.

## User Review Required

> [!IMPORTANT]
> **Extensible Architecture**: Snapping is now a separate pipeline. Stylus position is processed by the `SnapEngine` before reaching the active tool.
> **Visual Badges**: Unique icons will appear for different snap types (e.g., Triangle for Midpoint, Circle for Center) to provide clear feedback.
> **Performance**: To maintain fluid 60fps interaction, snapping logic uses spatial proximity thresholds and only checks visible geometries.

## Proposed Changes

### 1. Enhanced Snap Model
- **[MODIFY] core/sketch/SnapEngine.kt**:
    - Expand `SnapType` enum: `MIDPOINT`, `CENTER`, `INTERSECTION`, `ORIGIN`, `FACE_CENTER`.
    - Update `SnapResult` to include: `referencedGeometry: IGeometry?`, `confidence: Double`.

### 2. Snap Logic Implementation
- **[MODIFY] core/sketch/SnapEngine.kt**:
    - **Origin Snap**: Snap to (0,0,0) when close.
    - **Midpoint Snap**: Detect the middle of `Line` segments.
    - **Center Snap**: Detect the center of `Circle3D` and `Arc3D` entities.
    - **Intersection Snap**: Calculate and snap to points where two `Line` entities cross.
    - **Grid Snap**: Snap to the nearest grid intersection (respecting zoom).

### 3. Visual Feedback
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Add rendering for new snap badges.
    - Use dashed "Inference Lines" to show alignment with remote geometries (Parallel, Perpendicular).

### 4. Integration
- **[MODIFY] ui/CADViewModel.kt**:
    - Update `onSketchDrag` to handle the enriched `SnapResult`.
    - Ensure snapping works consistently across all sketch tools (Line, Circle, Rectangle).

## Roadmap

1.  **Refactor Engine**: Update `SnapType` and `SnapResult` structures.
2.  **Core Math**: Implement Midpoint, Center, and Intersection algorithms.
3.  **Visualization**: Update `CADCanvas` to draw distinct icons for each snap type.
4.  **Verification**: Test snapping with complex overlapping geometries.

## Verification Plan

### Automated Tests
- Unit tests for `SnapEngine.findIntersection(Line, Line)`.
- Unit tests for `SnapEngine.findMidpoint(Line)`.

### Manual Verification
- **Endpoint**: Verify snap to start/end of an existing line.
- **Midpoint**: Verify a triangle icon appears at the center of a line.
- **Center**: Verify a circle icon appears at the center of a 3D circle/arc.
- **Intersection**: Draw two crossing lines and verify snapping to their meeting point.
- **Horizontal/Vertical**: Verify auto-straightening snap with 'H'/'V' badges.
