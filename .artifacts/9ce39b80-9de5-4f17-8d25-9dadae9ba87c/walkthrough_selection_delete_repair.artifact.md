# Phase 2.0.8 — Selection & Delete Hardening / UI Refactoring

Repaired the authoritative selection and delete pipeline, implemented screen-space hit testing, and resolved tablet UI layout overlaps.

## Key Changes

### 1. Document-Wide Screen-Space Selection
- **Global Hit Testing**: SELECT mode now iterates through ALL visible sketches in the document.
- **Screen-Space Picking**: Distances are now calculated in pixels using `sketchToScreen` projections, ensuring consistent stylus behavior regardless of zoom or orientation.
- **Selection Policy**: Selecting an entity automatically activates its owning sketch (`activeSketchId`). This is done without rotating the camera or moving geometry.

### 2. Multi-Selection Policy
- **Sketch-Local Multi-Select**: Multiple entities can be selected only within the same sketch.
- **Cross-Sketch Safety**: Tapping an entity in a different sketch clears the previous selection and activates the new sketch.

### 3. Repaired Delete Pipeline
- **Owner Resolution**: `deleteSelectedEntity` now resolves each entity's owning sketch explicitly via `sketchId`.
- **Multi-Delete**: Support for removing multiple selected entities simultaneously.
- **Integrity**: `TOTAL ENTITIES` diagnostic now correctly decrements as geometry is removed from the document.

### 4. UI Layout Hardening
- **Refactored TopBar**: Split the top bar into three independent, compact components: `DocumentHeader`, `UndoRedoBar`, and `GlobalToolbar`.
- **Overlap Prevention**: Shifted the `GlobalToolbar` left (`120.dp` end padding) to ensure it never covers the `ViewCube`.
- **Centered Panels**: Expanded left panels (`CategoryPanel`, `SelectionFilterPanel`) are now horizontally offset to the right of the toolbar and vertically centered in the safe viewport.
- **Compact Branding**: Simplified branding to `TC_v0.1.$buildNo` and applied maximum width constraints.

### 5. Contextual State Machine
- **Automatic Cleanup**: Selection is now automatically cleared when entering creation tools (Line, Circle, etc.) to prevent UI interference.
- **Select Re-entry**: Ensured the SELECT mode can always be entered cleanly.

## Verification Results

### Automated Tests
- Updated `Phase21Test.kt` for new signatures.
- Created `Phase208Test.kt` for cross-sketch and multi-delete scenarios.
- Verified successful compilation with `assembleDebug`.

### Diagnostics
- Added `SELECTION COUNT`, `ACTIVE SKETCH`, and `HIT DISTANCE (px)` to the developer overlay.

## Next Steps
- Real-device validation of the improved selection tolerance and UI centering.
- Proceed to Phase 2.2 for entity translation/move logic.
