# TamerCAD Step 4 & Sprint 004 Task List

## Step 4: Left Tool Rail Redesign (COMPLETED)
- [x] Create `ui/toolbar/CategoryPanel.kt` for dynamic sub-menus.
- [x] Refactor `ui/toolbar/CADSideToolbar.kt` into a slim Tool Rail.
- [x] Integrate Rail + Panel in `MainCADScreen.kt`.
- [x] Ensure 44dp+ touch targets for all tools.

## Sprint 004: Parametric Sketch Engine & Constraints (COMPLETED)
- [x] Implement Constraint classes: `Coincident`, `Horizontal`, `Vertical`, `Parallel`, `Tangent`.
- [x] Upgrade `GCSManager.kt` to use iterative resolution (10 cycles).
- [x] Update `AddConstraintCommand.kt` to support Undo/Redo.
- [x] Add "Smart Inference" for H/V constraints during drawing in `CADViewModel.kt`.
- [x] Update `CADCanvas.kt` to render constraint badges (H, V, //, T).
- [x] Implement Blue/Black color coding for defined geometries.
- [x] Update `CADContextToolbar.kt` to support "Parallel" tool for multiple line selection.

## Step 5: Direct Modeling Deepening (Next)
- [ ] Connect Gizmo dragging to `ExtrudeFeature` depth updates.
- [ ] Implement Edge-specific manipulators for Fillet/Chamfer.
