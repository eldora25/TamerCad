# TamerCAD: Phase 4 - Intelligent Modify & Contextual Command System

This plan combines Step 6 (Modify Tools) and Step 7 (Context Toolbar) to create a highly responsive and intelligent command system. The UI will now anticipate the user's needs based on what is selected in the 3D viewport.

## User Review Required

> [!IMPORTANT]
> **Contextual Intelligence**: We will introduce a `SelectionContextResolver` that acts as the "brain" between the selection state and the UI. It will decide which tools to show in the bottom bar and which to enable in the side panel.
> **Zero Guesswork**: If an action is impossible for the current selection (e.g., Extruding an Edge), the tool will either be hidden or disabled.

## Proposed Changes

### 1. Intelligent Modify Category (Step 6)
- **[MODIFY] ui/toolbar/CategoryPanel.kt**:
    - Update `getToolsForCategory` to accept the current `SelectionType`.
    - Logic for `MODIFY` category:
        - `Fillet/Chamfer`: Enabled for **EDGE** or **FACE**.
        - `Shell/Offset Face/Draft`: Enabled for **FACE**.
        - `Mirror/Pattern`: Enabled for **BODY**.
        - `Boolean`: Enabled for **MULTIPLE** (if all are bodies).
    - Expand tool list with sub-variants:
        - Pattern -> Linear, Circular.
        - Mirror -> Body, Face, Feature.
        - Boolean -> Union, Subtract, Intersect.

### 2. Contextual Bottom Toolbar (Step 7)
- **[NEW] ui/contextual/SelectionContextResolver.kt**:
    - A utility to map `SelectionType` to a list of `ToolDefinition` objects.
- **[MODIFY] ui/contextual/CADContextToolbar.kt**:
    - Complete rewrite to dynamically render icons based on the resolver's output.
    - Match specific sets for: **NONE, VERTEX, EDGE, FACE, BODY, SKETCH, MULTIPLE**.
    - Ensure a slim, non-intrusive floating design at the bottom center.

### 3. Edge Modeling Deepening
- **[MODIFY] ui/CADViewModel.kt**:
    - Improve "Drill-Down" picking logic to reliably separate close Edges and Faces.
    - Project drag delta for `EDGE_OFFSET` handles to update radius parameters.
- **[MODIFY] ui/viewport/Manipulator3D.kt**:
    - Implement the yellow handle rendering for edges.

## Roadmap

1.  **Resolver & Bottom Bar**: Implement the dynamic context mapping and the new bottom UI.
2.  **Intelligent Side Panel**: Update the side category panel to respect selection states.
3.  **Edge Gizmos**: Connect the selection manager to the new edge manipulators.
4.  **Integration**: Ensure all actions trigger the correct `IFeature` updates.

## Verification Plan

### Automated Tests
- Validate the `SelectionContextResolver` mappings via unit tests.

### Manual Verification
- **None selected**: Bottom bar shows "Select, Sketch, Measure".
- **Select Face**: Bottom bar shows "Extrude, Offset, Fillet, Chamfer, Shell, Measure, Delete".
- **Select Edge**: Bottom bar shows "Fillet, Chamfer, Measure, Delete".
- **Select Body**: Bottom bar shows "Move, Rotate, Mirror, Pattern, Measure, Hide, Delete".
- **Drag Edge Handle**: Verify the yellow gizmo appears and allows radius manipulation.
