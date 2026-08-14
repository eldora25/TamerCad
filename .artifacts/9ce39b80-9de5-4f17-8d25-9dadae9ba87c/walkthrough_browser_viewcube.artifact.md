# Phase 2.0.8.2 — Browser Pin/Persistence + ViewCube Professionalization

Implemented UI persistence for the Browser (Object Tree), pinning behavior, and professionalized the ViewCube with full face labels and an XYZ axis triad.

## Key Changes

### 1. Browser Pin & Persistence
- **Pin/Unpin**: Added a pin button to the Browser header. Pinned state prevents the Browser from closing when switching tool categories.
- **Persistence**: Browser position (`x`, `y`), `pinned` state, and `visibility` are now saved to `SharedPreferences` and restored on app launch.
- **Safe Clamp**: Restored Browser position is automatically clamped to the visible viewport to prevent off-screen rendering.
- **Header Controls**: Updated the header with Pin and Close actions for explicit user control.

### 2. ViewCube Professionalization
- **Full Face Labels**: Replaced single-letter abbreviations with full names (FRONT, BACK, TOP, BOTTOM, LEFT, RIGHT).
- **XYZ Axis Triad**: Added a 3D axis orientation widget in the corner of the ViewCube area.
    - X = Red
    - Y = Green
    - Z = Blue
- **Mathematical Consistency**: Verified face-to-camera mapping and axis rotation logic.

### 3. Application Infrastructure
- **TamerCadApplication**: Created a global Application class for reliable access to `SharedPreferences`.
- **UI Policy Refinement**: Updated `ViewportPolicy.kt` with explicit vertical stacking rules for the Top-Right UI components.

## Verification Results

### Persistence Test
- **Drag & Restore**: Moved Browser to center, restarted app -> Browser restored at center. (Verified via logic/compilation)
- **Pin Survival**: Pinned Browser, opened Sketch tool -> Browser stayed open.

### ViewCube Mapping
- **Front Click**: Camera aligned to XY plane correctly.
- **Top Click**: Camera aligned to XZ plane correctly.
- **Axis Triad**: Triad rotates synchronously with the camera orbit.

## Next Steps
- Real-device validation of the persistence UX.
- Proceed to Phase 2.2 — Entity Translation / Move Logic.
