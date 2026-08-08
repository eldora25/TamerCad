# TAMERCAD CAD DEVELOPMENT — SPRINT 006 & 007

This plan covers the implementation of a professional Parametric Constraint System (GCS) and the foundational engine for Direct Modeling (Extrude, Move, Rotate, etc.) in TamerCAD, adhering to the "GLOBAL RULES".

## User Review Required

> [!IMPORTANT]
> **Deterministic GCS**: The current solver uses a basic iterative approach. For complex parametric designs, we will move towards a more robust relaxation-based solver.
> **True Direct Modeling**: Modeling operations (like Extrude) will operate on 3D geometry entities, ensuring that the model is mathematically correct and not just a visual simulation.
> **GitHub Integration**: All changes will be pushed to `https://github.com/eldora25/TamerCad.git` upon completion.

## Proposed Changes

### 1. Step 6: Parametric Constraint System (GCS)
- **[NEW] core/constraints/FixedConstraint.kt**: Anchors a point or line in space.
- **[NEW] core/constraints/ConcentricConstraint.kt**: Aligns centers of circles/arcs.
- **[NEW] core/constraints/MidpointConstraint.kt**: Constrains a point to the middle of a line.
- **[NEW] core/constraints/RadiusConstraint.kt**: Locks the radius value for circles/arcs.
- **[NEW] core/constraints/DiameterConstraint.kt**: Locks the diameter value.
- **[MODIFY] core/constraints/GCSManager.kt**:
    - Improve the solver loop to handle circular dependencies and propagation.
    - Ensure all constraints update the actual `Point3` and `IGeometry` data.

### 2. Step 7: Direct Modeling Engine
- **[MODIFY] core/features/ExtrudeFeature.kt**:
    - Improve profile detection (handling holes and multiple islands).
    - Implement Boolean operations: `New Body`, `Join`, `Cut`, `Intersect`.
- **[NEW] core/commands/MoveCommand.kt**: Deterministic translation of 3D bodies/faces.
- **[NEW] core/commands/RotateCommand.kt**: Deterministic rotation around an axis.
- **[MODIFY] core/features/FilletFeature.kt & ChamferFeature.kt**:
    - Ensure these features correctly modify the B-Rep topology of the `Solid3D`.
- **[NEW] core/modeling/BooleanEngine.kt**: Placeholder or basic implementation for C++ kernel Boolean operations.

### 3. Global Rules Enforcement
- Ensure all modeling operations support:
    - **Preview**: Temporary geometry shown during interaction.
    - **Confirm/Cancel**: Commitment to feature history.
    - **Undo/Redo**: Full integration with `CommandManager`.

## Roadmap

1.  **GCS Completion**: Implement missing constraints (`Fixed`, `Concentric`, `Midpoint`, `Radius`, `Diameter`).
2.  **Solver Refinement**: Stabilize the iterative resolution in `GCSManager`.
3.  **Direct Modeling Core**: Enhance `ExtrudeFeature` and implement `Move`/`Rotate` commands.
4.  **B-Rep Support**: Update `Fillet` and `Chamfer` to affect the solid model topology.

## Verification Plan

### Automated Tests
- Test cases for `FixedConstraint` anchoring.
- Test cases for `Extrude` volume calculation and vertex mapping.

### Manual Verification
- **Constraints**: Apply a `Fixed` constraint to a point; verify it cannot be dragged.
- **Parametrics**: Change a circle's radius; verify all lines constrained to it (Tangent, Coincident) update accordingly.
- **Modelling**: Perform a "Cut" extrude through an existing body and verify the 3D result.
