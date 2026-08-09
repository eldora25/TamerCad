# TAMERCAD SKETCH DEVELOPMENT — STEP 10 & 11

This plan implements full Snap/Inference integration across all sketch tools and provides a rich live feedback system during drawing, mirroring professional CAD workstations.

## User Review Required

> [!IMPORTANT]
> **Unified Snapping**: All sketch modes (Line, Circle, Rectangle, etc.) now use a centralized snap pipeline. This means "Midpoint" or "Parallel" snap works regardless of which tool is selected.
> **Transient Preview**: Preview geometry is drawn on a separate overlay and only converted to real CAD entities when the stylus is released.
> **Visual Language**: Dashed inference lines will show geometric relations (H/V alignment, Parallelism) while drawing.

## Proposed Changes

### 1. Unified Sketch Snapping (Step 10)
- **[MODIFY] ui/CADViewModel.kt**:
    - Refactor `onSketchDragStart` and `onSketchDrag` to apply `SnapEngine.snapPoint` to all `SKETCH_*` modes.
    - Route snapped coordinates to `rawStroke` and `previewGeometry`.
    - Ensure `interactionState` is set to `SKETCHING` during any sketch tool operation.

### 2. Live Visual Feedback (Step 11)
- **[MODIFY] ui/components/CADCanvas.kt**:
    - **Inference Lines**: Render dashed lines connecting the cursor to snap reference points.
    - **Live Dimensions**: Render a floating label near the cursor showing the current length (Line) or radius (Circle).
    - **State Indicators**: Explicitly show the active tool icon near the cursor if needed.
    - **Profile Highlight**: Use a subtle fill for closed loops detected by `ProfileValidator`.

### 3. Sketch Tool Preview Logic
- **[MODIFY] ui/CADViewModel.kt**:
    - Update `previewGeometry` to match the specific tool:
        - `SKETCH_LINE_MANUAL` -> Line
        - `SKETCH_RECT_DIAG` -> Rect (4 lines)
        - `SKETCH_POLYGON` -> Circle + Polygon proxy
        - `CIRCLE` -> Circle3D

## Roadmap

1.  **ViewModel Refactor**: Unify sketch input processing with snap support.
2.  **Canvas Rendering**: Add dashed lines and live dimension labels.
3.  **Tool-Specific Previews**: Implement correct preview geometry for Rectangle and Circle tools.
4.  **Verification**: Test snapping with existing 3D body edges while sketching on a plane.

## Verification Plan

### Automated Tests
- Test `SnapEngine` against mixed geometry types (Line vs Circle).
- Verify `CADViewModel` state transitions for all sketch tools.

### Manual Verification
- **Inference**: Draw a line; start another line and verify "Parallel" inference lines appear when aligned with the first.
- **Dimensions**: While dragging a circle, verify the radius value updates in real-time on the screen.
- **Closed Loop**: Draw a rectangle; verify it turns light blue (filled) when the last corner snaps to the start point.
- **Undo/Redo**: Commit a rectangle, undo it, and verify the 3D viewport is cleared correctly.
