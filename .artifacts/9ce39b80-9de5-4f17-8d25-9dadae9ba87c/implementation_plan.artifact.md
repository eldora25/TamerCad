# Phase 2.0.8 — Selection & Delete Hardening / UI Refactoring

This phase repairs the runtime behavior of selection and delete, implements document-wide hit-testing with screen-space accuracy, and resolves persistent UI layout overlaps on tablet devices.

## User Review Required

> [!IMPORTANT]
> **Active Sketch Policy**: Selecting an entity from an inactive sketch will automatically make its owning sketch the active one. This changes the editing context but will **not** rotate the camera or move geometry.

> [!IMPORTANT]
> **Multi-Selection Constraint**: Multi-selection is restricted to entities within the **same** SketchFeature. Selecting an entity from a different sketch will clear the current selection.

## Proposed Changes

### [Selection & Hit-Testing]

#### [MODIFY] [CADViewModel.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/CADViewModel.kt)
- Implement `findEntityAt(screenX, screenY)`:
    - Iterates through ALL visible sketches in `document.sketches`.
    - Projects entity geometry to screen space for distance evaluation.
    - Uses screen-space pixels for hit tolerance (visually consistent regardless of zoom).
    - Returns `PickResult` (sketchId, entityId, distance).
- Update `onPointSelected` for `SELECT` mode:
    - Calls `findEntityAt`.
    - Applies "Active Sketch on Selection" policy.
    - Manages multi-selection state (clearing if cross-sketch).
- Ensure camera DOES NOT rotate when `activeSketchId` changes via selection.

#### [MODIFY] [SelectionManager.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/selection/SelectionManager.kt)
- Track `selectedSketchId`.
- Add `selectSingle(entity, sketchId)`.
- Add `toggleInSketch(entity, sketchId)`:
    - If `sketchId` differs from current selection, clear and select new.
- Update `clear()` to reset `selectedSketchId`.

### [Delete Functionality]

#### [MODIFY] [CADViewModel.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/CADViewModel.kt)
- Fix `deleteSelectedEntity()`:
    - Support multiple selected entities.
    - Resolve each entity's owner sketch explicitly via `sketchId`.
    - Ensure `TOTAL ENTITIES` decrements correctly (derived from document state).

#### [MODIFY] [CADContextToolbar.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/contextual/CADContextToolbar.kt)
- Ensure the "Delete" button is correctly wired to `viewModel.deleteSelectedEntity()`.

### [UI Layout & Context Lifecycle]

#### [MODIFY] [ViewportPolicy.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/viewport/ViewportPolicy.kt)
- Refine constants for TopBar, ViewCube, and SideToolbar spacing.
- Define explicit horizontal bounds to prevent Top-Right toolbar from overlapping ViewCube.

#### [MODIFY] [MainCADScreen.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/MainCADScreen.kt)
- Implement `UIContext` state machine:
    - Close selection toolbar when creation tools (Line, Circle, etc.) are activated.
    - Ensure `Select` mode can always be re-entered.
- Fix expanded panel layout:
    - Position to the RIGHT of the main side toolbar.
    - Vertically center within safe working area.

#### [MODIFY] [CADTopBar.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/topbar/CADTopBar.kt)
- Further reduce padding/size of the document header.
- Ensure it doesn't overlap left tool panels.

### [Diagnostics]

#### [MODIFY] [CADCanvas.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/components/CADCanvas.kt)
- Expand debug overlay with:
    - Selection count & active sketch ID.
    - Screen-space hit distance.
    - UI Context state.

## Verification Plan

### Automated Tests
- Run `Phase21Test.kt` (updated for multi-sketch selection).
- Add new tests for:
    - `testCrossSketchSelectionRejected`
    - `testDeleteInactiveSketchEntity`
    - `testSelectionToolbarLifecycle`

### Manual Verification
- **Test 1**: Create entities in XY, XZ, YZ sketches. Select them individually. Verify `activeSketchId` updates but camera stays still.
- **Test 2**: Select multiple lines in one sketch. Delete them. Verify count.
- **Test 3**: Verify ViewCube is fully visible and clickable even when Top-Right toolbar is active.
- **Test 4**: Verify expanded left panels appear to the right of the toolbar and are centered.
