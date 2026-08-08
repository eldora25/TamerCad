# TamerCAD Grand Vision - Phase 2 & Phase 3 Deepening

## Phase 2: Application Structure & Layout Orchestration
- [ ] Refactor `CadScreen.kt` to be the primary entry point with professional layout.
- [ ] Ensure `Box` based layering: Viewport at Z=0, UI controls at Z=1+.
- [ ] Standardize floating panel behaviors (SideToolbar, TopBar, ContextToolbar).

## Phase 3 Deepening: Direct Modeling (Face Selection & Gizmos)
- [ ] Enhance Ray-Casting picking in `CADViewModel` to support individual `Face3D` selection.
- [ ] Implement "Face centroid" calculation for Gizmo positioning.
- [ ] Orient `Manipulator3D` (Gizmo) to align with the selected face's normal vector.
- [ ] Connect Gizmo dragging to `ExtrudeFeature` distance parameter update.
- [ ] Implement live geometry rebuild during dragging.

## Verification
- [ ] Build APK and verify layout on landscape tablet.
- [ ] Test face selection: tapping a face should select *only* that face and show the Gizmo.
- [ ] Test direct modeling: dragging the Gizmo arrow should dynamically resize the solid.
