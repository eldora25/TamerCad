# TAMERCAD — PHASE 0 — COMPLETE REPOSITORY ANALYSIS

This document provides a comprehensive audit of the TamerCad repository to establish a baseline for professional tablet CAD development.

## A. CURRENT ARCHITECTURE

TamerCad follows a layered architecture optimized for Android:
1. **Application Layer (`app/`)**: Standard Android module.
2. **UI Layer (`app/.../ui/`)**: Jetpack Compose based interface using the state-hoisting pattern via `CADViewModel`.
3. **Core CAD Layer (`app/.../core/`)**: Pure Kotlin implementation of the geometry engine, constraint solver, and command orchestration.
4. **Native Layer (`app/src/main/cpp/`)**: C++ kernel for high-performance B-Rep (Boundary Representation) and Boolean operations.

## B. ACTUAL ANDROID EXECUTION PATH

The code that actually runs on the device is strictly contained within:
- **`app/src/main/java/com/tamercad/`**: All active logic.
- **`app/src/main/cpp/`**: Native kernel logic.

> [!WARNING]
> The directories `core/` and `src/` at the project root are **non-executable**. They appear to be architectural blueprints, documentation, or early prototypes (e.g., `RenderViewport.ts`). They are NOT part of the Gradle build path.

## C. CAD ENGINE ARCHITECTURE

- **Document State**: Managed by `CADDocument.kt`. Concepts like Units, Assembly, and Sketches are centralized here.
- **Geometry**: Defined in `core/geometry/`. Uses standard 3D primitives (`Line`, `Circle3D`, `Solid3D`).
- **Constraints**: Managed by `GCSManager.kt`. Uses an iterative solver to resolve geometric relationships (Parallel, Tangent, etc.).
- **Commands**: Implements the Command Pattern (`core/commands/`) for robust Undo/Redo functionality.
- **B-Rep**: Initial structures are present in `tamercad_kernel.cpp` but require deepening for robust production use.

## D. UI ARCHITECTURE

- **Orchestrator**: `MainCADScreen.kt` manages the Z-index layering of the UI.
- **Viewport**: `CADViewport.kt` hosts the 3D drawing area and navigation tools.
- **Canvas**: `CADCanvas.kt` handles the actual drawing using 3D-to-2D projection math.
- **Navigation**: `NavigationCube.kt` provides deterministic camera alignment.

## E. INPUT ARCHITECTURE

- **Isolation**: `StylusInputManager.kt` correctly separates `PointerType.Stylus` from `PointerType.Touch`.
- **Gesture Logic**: `PencilGestureDetector.kt` implements Shapr3D-like "Dwell" conditions for auto-straightening.
- **State Machine**: `InteractionState.kt` ensures input is routed correctly (e.g., preventing camera movement during a sketch drag).

## F. DUPLICATE SYSTEMS

| System | Duplicate Locations Found | Active Path |
| :--- | :--- | :--- |
| **Geometry** | `root/src/geometry/` vs `app/src/.../core/geometry/` | `app/.../core/geometry/` |
| **Math** | `root/src/math/` vs `app/src/.../core/math/` | `app/.../core/math/` |
| **Commands** | `root/src/core/commands/` vs `app/.../core/commands/` | `app/.../core/commands/` |
| **Persistence** | `root/src/persistence/` vs `app/.../core/serialization/` | `app/.../core/serialization/` |

## G. MISSING SYSTEMS

1. **Advanced B-Rep Boolean Engine**: Placeholder exists in C++, but logic is not yet production-ready.
2. **Adaptive UI for Multi-Platform**: The current UI is heavily Android-Tablet centric (which is the current goal).
3. **Advanced Snap Indicators**: Specialized icons for "Tangent" or "Intersection" are partially implemented but not fully polished.

## H. CRITICAL TECHNICAL DEBT

- **Canvas Weight**: `CADCanvas.kt` is currently responsible for too many rendering tasks. Logic should be delegated to specialized renderers.
- **Math Redundancy**: Some math operations are calculated both in Kotlin and C++.
- **View Scaling**: Zoom and Pan calculation needs normalization across different screen densities.

## I. IMPLEMENTATION ORDER (PHASE 1)

1. **Input Hard-Lock**: Solidify Finger-Navigation and Stylus-Modeling separation.
2. **Unified Snapping**: Ensure all tools use the centralized `SnapEngine`.
3. **Direct Modeling Manipulators**: Enhance `Manipulator3D` for face and edge dragging.
4. **B-Rep Deepening**: Move core Boolean logic into the C++ kernel.
5. **Persistence Polish**: Ensure `CADDocument` saves/loads complex feature histories perfectly.
