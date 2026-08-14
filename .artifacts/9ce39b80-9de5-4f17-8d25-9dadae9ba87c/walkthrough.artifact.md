# Phase 2.1 — Sketch Entity Selection & Delete

Implemented authoritative entity selection, hit-testing, and delete functionality for the Sketcher.

## Key Changes

### 1. Authoritative Hit-Testing
- Updated `SketchFeature.pickGeometry` with precise hit-testing for:
    - **SketchLine**: Segment distance logic.
    - **SketchCircle**: Distance to perimeter.
    - **SketchArc**: Angle-aware perimeter distance.
    - **SketchRect**: Distance to 4 boundary segments.
- Added `lastHitDistance` tracking for diagnostics.

### 2. Selection State Management
- Updated `SelectionManager` with authoritative `selectedEntityId` and `selectedSketchId`.
- Selection logic in `CADViewModel.onPointSelected` handles `SELECT` mode, updating state or clearing it (empty-space deselection).

### 3. Visual Feedback & UI
- **Highlighting**: Selected entities are now drawn in **Yellow** (`TamerCadColors.SelectionColor`) with double stroke width in the viewport.
- **Object Tree**: The browser now highlights the sketch owning the selected entity.
- **Diagnostics Overlay**: Added selection details:
    - `SELECTED ENTITY ID`
    - `SELECTED SKETCH ID`
    - `SELECTED ENTITY TYPE`
    - `HIT DISTANCE`
    - `COMMAND ACTIVE`

### 4. Delete & Command Termination
- Implemented `CADViewModel.deleteSelectedEntity()` using `RemoveGeometryCommand` for isolation (only removes the selected entity).
- Ensured switching to `SELECT` tool or switching planes resets any active construction state (Line/Circle/etc.).

### 5. Verification
- **Build**: Successful `assembleDebug` build.
- **Tests**: Created `Phase21Test.kt` covering:
    - Line, Circle, Arc, Rectangle selection.
    - Empty-space deselection.
    - Delete isolation (XY doesn't affect XZ).
    - Command termination on tool/plane switch.
    - Regression check: selection does not move geometry.

## Next Steps
- Implement entity translation (move) logic in Phase 2.2.
- Integrate selection menu actions (Delete, Fillet, etc.) into the context toolbar.
