# TamerCAD: Phase 8 - Professional Camera, Sketch Engine, and AR Integration

This comprehensive plan covers the transition of TamerCAD into a professional workstation by refining the camera navigation, improving the parametric sketch engine for production use, and implementing Articulated 1:1 Augmented Reality (AR) visualization.

## User Review Required

> [!IMPORTANT]
> **Branding Update**: The header will be strictly set to `TamerCadv01.[BUILD_NO] Tamer YAMAK©` as per the visual requirement.
> **Input Priority**: Stylus now has absolute priority for modeling. Camera navigation (Orbit/Pan/Zoom) is restricted to Finger touch to prevent accidental camera movement while drawing.
> **ARCore Requirements**: 1:1 AR mode requires an ARCore-supported device. The app will check for compatibility before launching the AR bridge.

## Proposed Changes

### 1. Professional Camera Navigation (Step 10)
- **[MODIFY] ui/CADViewModel.kt**:
    - Add explicit view methods: `setFrontView()`, `setBackView()`, `setTopView()`, `setBottomView()`, `setLeftView()`, `setRightView()`, `setIsometricView()`.
    - Implement smooth transitions (Interpolation) between camera states.
- **[MODIFY] ui/components/CADCanvas.kt**:
    - Refine gesture routing: 1-finger (Orbit), 2-finger (Pan), Pinch (Zoom).
    - Ensure `isStylusInUse` block effectively prevents camera movement during sketching.

### 2. Professional Sketch Engine (Step 5 Improvement)
- **[MODIFY] core/sketch/SketchFeature.kt**:
    - Improve data persistence for sketches. Each entity now tracks its own set of constraints.
- **[MODIFY] ui/CADViewModel.kt**:
    - Implement a structured "Enter/Exit Sketch" flow that validates profiles (checking for closed loops).
    - Convert stylus strokes into real CAD entities (`Line`, `Circle3D`, etc.) via `AddGeometryCommand`.
- **[NEW] core/sketch/ProfileValidator.kt**: Utility to detect closed loops in a sketch for Extrude/Revolve operations.

### 3. ARCore Entegrasyonu (1:1 Scale)
- **[MODIFY] core/rendering/ArCoreBridge.kt**:
    - Implement actual AR session initialization.
    - Map CAD world units (mm) to AR meters (1000mm = 1m) for 1:1 visualization.
    - Provide a way to place the model on a detected horizontal surface.

### 4. UI Branding & Header Fix
- **[MODIFY] ui/topbar/CADTopBar.kt**:
    - Implement the specific branding format requested in the image.

## Roadmap

1.  **Input & Camera**: Solidify the Finger/Stylus separation and ViewCube corners.
2.  **Sketching Logic**: Profile validation and persistent sketch entity conversion.
3.  **AR Foundation**: ARCore setup and unit scaling.
4.  **Final Polish**: UI branding and transition animations.

## Verification Plan

### Automated Tests
- Unit tests for `ProfileValidator` (detecting a closed rectangle).
- Test camera projection math for 90-degree orthographic views.

### Manual Verification
- **Camera**: Tap ViewCube faces and corners; verify exact alignment. Perform pinch-zoom and 2-finger pan.
- **Sketching**: Draw a closed shape; verify it highlights as a "Profile" ready for Extrude.
- **AR**: Launch AR mode and verify the model appears on a table at its real physical size.
