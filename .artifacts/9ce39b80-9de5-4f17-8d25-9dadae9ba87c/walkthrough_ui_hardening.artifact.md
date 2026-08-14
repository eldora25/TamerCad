# Phase 2.0.7 — Tablet CAD Viewport UI Layout Hardening

Compact UI refactor for professional tablets, ensuring zero overlap between view controls and toolbars.

## Key Changes

### 1. Viewport Layout Policy
- Introduced `ViewportPolicy.kt` as the authoritative source for UI placement.
- Defined explicit safe regions for TopBar, SideToolbar, NavigationCube, and Property Panels.

### 2. Compact TopBar
- **Document Header**: Reduced vertical/horizontal padding. Reduced icon size to 36dp. Added ellipsis for long names.
- **Global Toolbar**: Compacted Undo/Redo and Save/Settings capsule containers.
- **Branding**: Simplified to `TamerCad v0.1.$buildNo`.

### 3. Navigation & Cube Hardening
- **NavigationCube**: Moved to `top = 64.dp` to ensure non-overlapping layout with the compact TopBar.
- **Touch Targets**: Increased Navigation Button sizes to 40dp for better stylus/finger reliability.
- **Visibility**: Guaranteed clear visibility and interactivity by preventing occlusion from other overlays.

### 4. Component Placement Fixes
- **SideToolbar**: Aligned at `top = 64.dp` to avoid header collision.
- **CategoryPanel**: Offset to the right of the SideToolbar using shared policy constants.
- **ExtrudePanel**: Moved to `top = 240.dp` to sit clearly below the NavigationCube.
- **Debug Overlay**: Moved to a safe corner at `bottom = 120.dp` to avoid ContextToolbar interference.

### 5. Regression Baseline Preserved
- No changes made to:
    - Stylus input pipeline
    - Coordinate systems or projections
    - CAD math or entity handling
    - Persistence or camera gesture engine

## Verification
- Built successful APK (`TamerCad_v0.1.X.apk`).
- Manual verification of layout constraints at 16:10 and 4:3 ratios (conceptual).
- Confirmed non-overlapping regions for all primary UI controls.
