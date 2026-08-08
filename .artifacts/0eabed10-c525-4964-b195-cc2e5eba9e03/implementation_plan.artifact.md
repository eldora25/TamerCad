# TamerCAD: Phase 2 UI Redesign (Left Tool Rail) & Sprint 004 (Parametric Constraints)

This plan covers the transition to a professional "Tool Rail" system and the implementation of a fully parametric sketch engine with geometric constraints.

## User Review Required

> [!IMPORTANT]
> **Tool Rail Interaction:** Tapping a category on the rail opens a secondary panel to the right. Tapping the same category again closes it.
> **Constraint Badges:** Icons like "H" (Horizontal) and "V" (Vertical) will appear automatically near lines. They are persistent and can be deleted by tapping them in "Select" mode.
> **Solver Stability:** The GCS (Geometric Constraint Solver) will use a Newton-Raphson style iterative approach.

## Proposed Changes

### 1. Left Tool Rail Redesign (Step 4)
- **[MODIFY] ui/toolbar/CADSideToolbar.kt**: Refactor to `CADToolRail`. It will only show the 7 primary categories.
- **[NEW] ui/toolbar/CategoryPanel.kt**: A sleek, dark, floating panel that opens when a category is active.
    - Displays icons + labels for specific tools (e.g., Line, Rectangle under Sketch).
    - Uses `TamerCadDimensions` for tablet-optimized touch targets.

### 2. SPRINT 004: Geometric Constraints (Core)
- **[NEW] core/constraints/CoincidentConstraint.kt**: Locks two points.
- **[NEW] core/constraints/HorizontalConstraint.kt**: Locks a line to 0/180 degrees.
- **[NEW] core/constraints/VerticalConstraint.kt**: Locks a line to 90/270 degrees.
- **[NEW] core/constraints/ParallelConstraint.kt**: Forces two lines to have the same slope.
- **[NEW] core/constraints/TangentConstraint.kt**: Locks a line to the tangent of a circle/arc.
- **[MODIFY] core/constraints/GCSManager.kt**: Enhanced solver loop with error detection.

### 3. SPRINT 004: Visualization & Interaction
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Draw constraint badges (H, V, //, T) at the midpoint of geometries.
    - Implement color-coded status: Blue (Under-defined), Black (Fully-defined), Red (Conflict).
- **[MODIFY] core/sketch/SnapEngine.kt**: Add "Smart Inference" to suggest H/V constraints while drawing.

## Roadmap

1.  **Tool Rail & Panels:** Modernize the left-side interaction.
2.  **Constraint Models:** Implement the math for H, V, and Coincident.
3.  **Solver Update:** Integrate multi-constraint resolution.
4.  **Canvas Rendering:** Show constraint badges and update line colors.

## Verification Plan

### Automated Tests
- Test cases for a constrained rectangle (4 coincident, 2 horizontal, 2 vertical).
- Test cases for tangent lines.

### Manual Verification
- Verify Tool Rail opens/closes category panels.
- Draw a nearly horizontal line; verify it snaps and shows 'H'.
- Apply dimensions; verify the line turns Black.
