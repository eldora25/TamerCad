# TamerCAD UI Redesign - Phase 7: Measurements, Model Tree & Settings

This phase focuses on professionalizing the data inspection and configuration layers of TamerCAD. We will implement a robust measurement system, a hierarchical model tree, and a comprehensive settings suite.

## User Review Required

> [!IMPORTANT]
> **Measurement Driving Constraints**: Editing a measurement value will attempt to apply a corresponding constraint (e.g., `DistanceConstraint`) to the involved geometries.
> **Model Tree Hierarchy**: The tree will now show the full assembly structure: Assembly -> Components -> Features -> Sketches -> Geometries.
> **Centralized Settings**: All application preferences will be moved to a single `SettingsState` managed by the `CADViewModel` or a dedicated `SettingsViewModel`.

## Proposed Changes

### 1. Advanced Measurement System (Step 15)
- **[NEW] core/analysis/MeasurementEngine.kt**:
    - Logic for computing distances, angles, areas, and volumes between various `IGeometry` types.
- **[MODIFY] ui/CADViewModel.kt**:
    - Add `measurementSelection: List<IGeometry>` state.
    - Implement logic to handle multi-selection specifically for measurement mode.
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Update `renderDimensionBubble` to support leader lines and specialized formatting for angles/areas.
    - Render measurement labels for the active selection.

### 2. Hierarchical Model Tree (Step 16)
- **[MODIFY] ui/components/ObjectTree.kt**:
    - Refactor to support nested nodes.
    - Implement expansion/collapse toggles for Components and Features.
    - Add icons for different node types (Origin, Plane, Body, Sketch, Extrude, etc.).
    - Implement context menus (long-press) for all node levels.
- **[MODIFY] core/assembly/Component3D.kt**: Ensure features and sketches are correctly exposed for tree traversal.

### 3. Professional CAD Settings (Step 17)
- **[NEW] ui/app/SettingsScreen.kt**:
    - Categorized settings UI: General, Navigation, Stylus, View, Selection, Performance, File.
    - Use standard CAD toggles (e.g., Perspective vs Orthographic, Grid visibility).
- **[NEW] ui/state/SettingsState.kt**: Data class to hold all configuration tokens.
- **[MODIFY] ui/MainCADScreen.kt**: Add logic to show the Settings Screen as a full-screen overlay or large modal.

## Roadmap

1.  **Model Tree Update**: Expand the browser to show the full feature history.
2.  **Measurement Engine**: Implement the math for diverse measurement types and labels.
3.  **Settings Suite**: Create the centralized settings state and UI.
4.  **Integration**: Ensure settings (like Grid visibility) correctly affect the `CADCanvas`.

## Verification Plan

### Automated Tests
- Unit tests for `MeasurementEngine` (Point-to-Plane, Edge-to-Edge angle).
- Verify `SettingsState` persistence (if implemented).

### Manual Verification
- **Measurement**: Select two parallel faces; verify the distance label appears with a leader line between them. Edit the value and check if it moves the faces.
- **Model Tree**: Expand a Body node; verify its "Extrude" feature and "Sketch" are visible. Rename a feature from the tree.
- **Settings**: Toggle "Grid" off in Settings; verify it disappears from the viewport.
