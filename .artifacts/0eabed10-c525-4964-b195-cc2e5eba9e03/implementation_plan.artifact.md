# TamerCAD: Phase 5 - Professional Selection, Navigation, and Assembly System

This plan covers the transformation of TamerCad into a production-grade 3D environment. We will finalize the selection engine, overhaul the 3D navigation widget (ViewCube), and introduce the core mechanical assembly (Mate) system.

## User Review Required

> [!IMPORTANT]
> **Top Bar Brand Change**: The header will be updated to `TamerCadv01.(BUILDNO) Tamer YAMAK©` with auto-truncation for smaller screens.
> **Mate System Workflow**: Mates will be applied by selecting two entities (e.g., two faces) and choosing a mate type from the contextual menu.
> **Navigation Overhaul**: The ViewCube will support isometric corner clicks and orthographic face clicks with smooth transitions.

## Proposed Changes

### 1. Branding & Versioning
- **[MODIFY] ui/topbar/CADTopBar.kt**:
    - Update project name format to: `TamerCadv01.[BUILD_NO] Tamer YAMAK©`.
    - Ensure robust ellipsis truncation for long Design names.

### 2. Advanced Selection System (Step 8)
- **[MODIFY] ui/selection/SelectionManager.kt**:
    - Full support for `VERTEX`, `EDGE`, `FACE`, `BODY`, `SKETCH`, `FEATURE`.
    - States: `Idle`, `Hover`, `Selected`, `MultiSelected`.
    - Integrated filter flags: `showVertices`, `showEdges`, `showFaces`, `showBodies`.
- **[MODIFY] ui/CADViewModel.kt**:
    - Implement the centralized picking pipeline: `pick3DEntity` -> `SelectionManager`.
    - Add `onHover` stylus event handling.
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Implement visual feedback for multi-selection and hover states (glowing edges/faces).

### 3. Professional View Navigation (Step 9)
- **[MODIFY] ui/components/NavigationCube.kt**:
    - Add support for **Corner Taps** (Isometric views).
    - Refine **Face Taps** for exact 90-degree alignment.
    - Add satellite buttons: **Home**, **Fit All**, **Perspective/Orthographic Toggle**.
- **[MODIFY] ui/CADViewModel.kt**:
    - Implement `fitAll()`: Calculate bounding box of visible geometry and adjust camera zoom/pan.

### 4. Assembly & Mate System
- **[NEW] core/assembly/MateModels.kt**:
    - `CoincidentMate`: Align faces/points.
    - `ConcentricMate`: Align circular axes.
    - `ParallelMate`: Align face normals.
- **[MODIFY] core/assembly/Assembly3D.kt**:
    - Implement a basic solver to apply mate constraints iteratively.
- **[MODIFY] ui/contextual/CADContextToolbar.kt**:
    - Add "Mate" tools to the `MULTIPLE` selection menu.

## Roadmap

1.  **Selection & Branding**: Finalize the core interaction and top bar.
2.  **ViewCube Upgrade**: Complete the navigation widget and camera controls.
3.  **Assembly Foundation**: Implement mate types and the iterative solver.
4.  **Mate UI**: Enable mechanical assembly via the contextual toolbar.

## Verification Plan

### Automated Tests
- Unit tests for Bounding Box calculation (`Fit All`).
- Integration tests for Mate resolution (e.g., verifying that two faces are parallel after mate).

### Manual Verification
- **Header**: Verify the new branding and version text.
- **Selection**: Move stylus over edges; verify hover glow. Use multi-select to pick two faces.
- **ViewCube**: Click corners to go Isometric. Test "Fit All" with multiple bodies spread out.
- **Mates**: Select two faces, click "Coincident Mate", and verify the bodies snap together.
