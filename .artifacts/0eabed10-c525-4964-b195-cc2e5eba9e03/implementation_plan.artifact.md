# TamerCAD: Phase 6 - Professional Sketch Mode, Stylus UX, and B-Rep Kernel Deepening

This massive update focuses on bridging the gap between a "tool" and a "workstation". We will implement a dedicated Sketch Mode with plane selection, a highly refined stylus-first drawing experience with smart inference, an interactive Extrude system with real-time manipulators, and a deeper B-Rep kernel in C++.

## User Review Required

> [!IMPORTANT]
> **Sketch Plane Transition**: Tapping "Create Sketch" will now dim the 3D scene and present XY, XZ, and YZ planes. Selecting a plane will align the camera and enter a specialized "Sketch Mode".
> **Stylus Priority**: When the stylus is down in Sketch Mode, all touch inputs are strictly ignored for drawing (Palm Rejection) but two-finger navigation remains available.
> **B-Rep Kernel**: We are transitioning from simple meshes to a "Boundary Representation" topology. This is a significant change in the C++ layer that will allow for robust Boolean operations.
> **ARCore Integration**: We will implement 1:1 scale visualization. This requires ARCore-compatible hardware and will switch the background to the live camera feed.

## Proposed Changes

### 1. Dedicated Sketch Mode (Step 11)
- **[MODIFY] ui/CADViewModel.kt**:
    - Add `activeSketchPlane: Plane?` and `isSketchMode: Boolean`.
    - Implement `enterSketchMode(plane)` and `exitSketchMode(commit: Boolean)`.
- **[NEW] ui/sketch/PlaneSelector.kt**: UI component for selecting the initial 2D plane (XY, XZ, YZ).
- **[MODIFY] ui/toolbar/CategoryPanel.kt**: Update to show the full Sketch Toolbar (Line, Circle, Arc, Slot, Spline, Trim, Constraints) when in Sketch Mode.
- **[NEW] ui/sketch/SketchStatusLabel.kt**: Bottom-right indicator for "Fully-Constrained", etc.

### 2. Stylus-First Sketching & Inference (Step 12)
- **[MODIFY] ui/CADViewModel.kt**:
    - Implement real-time `previewGeometry` during drag.
    - Enhance `SnapEngine` with Midpoint, Center, and Tangent detection.
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Render real-time inference lines (dashed orange lines for H/V or Parallel alignments).
    - Show "Coincident" or "Tangent" badges under the stylus tip before release.

### 3. Interactive Extrude & Boolean UI (Step 13)
- **[NEW] ui/modeling/ExtrudeController.kt**:
    - Manage temporary `ExtrudePreview`.
    - Handle Boolean operation toggles (Join, Cut, Intersect).
- **[MODIFY] ui/viewport/Manipulator3D.kt**: Add a specialized Extrude handle (3D Arrow with numeric floating label).
- **[MODIFY] ui/MainCADScreen.kt**: Add a small overlay for Extrude parameters (Distance, Symmetric, Reverse).

### 4. B-Rep Kernel Deepening (Parasolid Lite)
- **[MODIFY] app/src/main/cpp/tamercad_kernel.cpp**:
    - Implement `BRepTopology` structure: `Solid` -> `Shell` -> `Face` -> `Loop` -> `Edge` -> `Vertex`.
    - Add `computeBoolean(SolidA, SolidB, Type)` placeholder with basic AABB pruning.
- **[NEW] app/src/main/java/com/tamercad/core/kernel/NativeKernelBridge.kt**: Formalize JNI calls for complex modeling features.

### 5. ARCore 1:1 Scale (Next Steps)
- **[MODIFY] core/rendering/ArCoreBridge.kt**:
    - Implement Plane tracking.
    - Implement 1:1 scaling logic (Project units -> Meters).
    - Background camera feed integration.

## Roadmap

1.  **Sketch Infrastructure**: Mode switching and Plane Selection.
2.  **Stylus Refinement**: Live preview, SnapEngine upgrades, and Smart Inference.
3.  **Modeling Interaction**: Extrude Gizmo and Boolean UI.
4.  **Native Kernel**: B-Rep data structures and JNI bridge.
5.  **ARCore**: 1:1 visualization mode.

## Verification Plan

### Automated Tests
- GCS integration tests for multi-plane constraints.
- Native kernel unit tests (via NDK tests) for topology consistency.

### Manual Verification
- **Sketch**: Enter Sketch mode on XZ plane; verify camera rotates correctly. Draw a line with grid snap.
- **Extrude**: Select a closed circle; click Extrude; drag the arrow; verify 3D volume updates.
- **AR**: Enter AR mode; verify the model sits on the floor at correct dimensions.
