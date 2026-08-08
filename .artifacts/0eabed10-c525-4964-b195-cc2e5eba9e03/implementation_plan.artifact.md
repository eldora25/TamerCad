# TamerCAD UI Redesign - Step 1: Design System

This plan establishes a comprehensive Design System for TamerCad, moving away from hard-coded values to a token-based system. This will ensure consistency across the application and make it easier to maintain and evolve the professional tablet-first look.

## User Review Required

> [!IMPORTANT]
> This phase only affects theme and styling files. Existing CAD logic and component structure remain unchanged.
> We are using the existing Jetpack Compose framework.

## Proposed Changes

### 1. Unified Color Tokens
- **[MODIFY] ui/theme/TamerCadColors.kt**:
    - Add missing tokens: `SurfaceElevated`, `SurfacePressed`, `SurfaceSelected`.
    - Add specific axis colors: `AxisX` (Red), `AxisY` (Green), `AxisZ` (Blue).
    - Refine existing colors for a more professional dark-mode look.

### 2. Unified Dimension Tokens
- **[MODIFY] ui/theme/TamerCadDimensions.kt**:
    - Add `Elevation` tokens (None, Low, Medium, High).
    - Add `BorderWidth` tokens (Thin, Regular, Thick).
    - Standardize `TouchTarget` values.

### 3. Theme Integration
- **[MODIFY] ui/theme/TamerCadTheme.kt**:
    - Ensure all Material 3 components map correctly to TamerCad design tokens.

## Roadmap

1.  **Color Tokens:** Update `TamerCadColors.kt` with the full set of requested tokens.
2.  **Dimension Tokens:** Update `TamerCadDimensions.kt` with elevation and border tokens.
3.  **Refactor References:** Briefly check if any immediate UI components should use these new tokens instead of old names.

## Verification Plan

### Automated Tests
- Build verification to ensure no compilation errors.

### Manual Verification
- Visual inspection of the UI to ensure the "Dark UI" theme is applied correctly.
- Verify that the 3D viewport axes use the new `AxisX`, `AxisY`, `AxisZ` tokens.
