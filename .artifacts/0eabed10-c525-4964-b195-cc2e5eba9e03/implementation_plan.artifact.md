# TamerCAD UI Redesign - Step 8: Advanced CAD Selection System

This plan transforms the current selection logic into a professional, multi-state selection engine. It introduces hover support, multi-selection, and user-configurable selection filters, matching the interaction standards of high-end CAD software.

## User Review Required

> [!IMPORTANT]
> **Hover Support**: Hover effects require an active stylus that supports hover events. Finger touch will continue to use tap-to-select.
> **Multi-Selection**: We will implement a "Toggle Multi-Select" mode in the Selection Filter panel to allow selecting multiple entities without holding a keyboard modifier.
> **Version Text**: The top bar version text will be made dynamic and auto-truncating to ensure it never overflows on smaller tablet screens.

## Proposed Changes

### 1. Dynamic Version & Top Bar Truncation
- **[MODIFY] ui/topbar/CADTopBar.kt**:
    - Improve the truncation logic for `displayProjectName`.
    - Ensure the layout is flexible enough to handle different font scales.

### 2. Enhanced Selection Manager
- **[MODIFY] ui/selection/SelectionManager.kt**:
    - Add `hoveredEntity: IGeometry?` state.
    - Add `isMultiSelectMode: Boolean` toggle.
    - Implement `setHover(entity: IGeometry?)`.
    - Update `select()` to handle single vs multi-selection logic based on the mode.
    - Add observable boolean flags for filters: `showVertices`, `showEdges`, `showFaces`, `showBodies`.

### 3. Selection Filter UI
- **[NEW] ui/selection/SelectionFilterPanel.kt**:
    - A small, floating overlay (likely near the Tool Rail) to toggle selection filters and multi-select mode.

### 4. Advanced Picking & Hover Engine
- **[MODIFY] ui/CADViewModel.kt**:
    - Refine `pick3DEntity` to strictly respect the `SelectionManager` filters.
    - Add `onHover(offset: Offset, screenWidth: Float, screenHeight: Float)` function.
    - Update `onTap` to support multi-select via `selectionManager.toggle()`.

### 5. High-Fidelity Rendering
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Implement **Hover Highlight**: Render a faint, semi-transparent overlay on the `hoveredEntity`.
    - Implement **Multi-Select Visualization**: Iterate through all `selectedEntities` in the manager and draw their outlines/highlights.
    - Add `PointerEventType.Move` detection to trigger hover events.

## Roadmap

1.  **Selection Logic**: Upgrade `SelectionManager` with hover and multi-select states.
2.  **Picking Upgrade**: Connect `pick3DEntity` to filters and implement the `onHover` pipeline.
3.  **UI Components**: Create the `SelectionFilterPanel` and fix the `CADTopBar` text.
4.  **Canvas Integration**: Add hover rendering and multi-highlighting to the main viewport.

## Verification Plan

### Automated Tests
- Test `SelectionManager` single vs multi-select transitions.
- Verify `pick3DEntity` returns `null` when all filters are disabled.

### Manual Verification
- **Hover**: Move stylus over a 3D face; verify it glows lightly.
- **Multi-Select**: Enable multi-select mode; tap three different faces; verify all three remain highlighted.
- **Filters**: Disable "Face" filter; verify that faces can no longer be selected even if tapped directly.
- **Top Bar**: Check that the version text fits perfectly in both Landscape and Portrait.
