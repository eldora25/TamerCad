# ADR-0003 — CAD Engine Architecture

- **Status:** Accepted
- **Date:** 2026-07-31
- **Version:** 0.1.0-alpha
- **Project:** TamerCAD

---

# 1. Purpose

This document defines the high-level architecture of the TamerCAD engine.

The CAD Engine is the core of the application and is responsible for creating, modifying, storing, and rendering geometric models.

The architecture is designed for long-term scalability, maintainability, and high performance.

---

# 2. Problem Statement

A CAD application combines many responsibilities:

- Geometry
- Rendering
- User Interaction
- Constraints
- History
- Selection
- Import / Export

Keeping all of these responsibilities inside one engine would produce tightly coupled code that is difficult to test and maintain.

The engine must therefore be divided into specialized modules.

---

# 3. Decision

The CAD Engine shall be composed of independent subsystems.

Each subsystem has a single responsibility and communicates only through well-defined interfaces.

---

# 4. Engine Overview

```text
                +----------------------+
                |      User Input      |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |   Command System     |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |    History Engine    |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |      CAD Kernel      |
                +----------+-----------+
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
+---------------+  +----------------+  +---------------+
| Sketch Engine |  | Constraint Eng.|  | Solid Engine  |
+-------+-------+  +--------+-------+  +-------+-------+
        |                   |                  |
        +---------+---------+------------------+
                  |
                  v
         +--------------------+
         | Rendering Engine   |
         +--------------------+
```

---

# 5. Engine Modules

## CAD Kernel

Responsibilities

- Owns project state
- Coordinates all engines
- Dispatches commands
- Maintains object references

The CAD Kernel must not contain rendering logic.

---

## Sketch Engine

Responsibilities

- Lines
- Circles
- Arcs
- Splines
- Rectangles
- Polygons
- Construction Geometry

Outputs parametric sketch entities.

---

## Constraint Engine

Responsibilities

- Coincident
- Parallel
- Horizontal
- Vertical
- Tangent
- Equal
- Symmetry
- Distance
- Angle

The Constraint Engine never draws graphics.

---

## Solid Engine

Responsibilities

- Extrude
- Revolve
- Loft
- Sweep
- Fillet
- Chamfer
- Boolean Operations

Future versions may integrate a dedicated solid modeling kernel.

---

## Rendering Engine

Responsibilities

- Draw geometry
- Camera
- Grid
- Selection highlight
- Dynamic preview
- GPU rendering

Rendering must remain independent from modeling logic.

---

## Selection Engine

Responsibilities

- Hit testing
- Multi-selection
- Gesture handling
- Hover detection
- Selection filters

---

## History Engine

Responsibilities

- Undo
- Redo
- Command replay
- Transaction grouping

All model modifications must pass through the History Engine.

---

# 6. Data Flow

```text
Stylus
   |
Touch
   |
   v
Input Manager
   |
   v
Command System
   |
   v
History Engine
   |
   v
CAD Kernel
   |
   +------------------------------+
   |                              |
   v                              v
Sketch Engine              Solid Engine
   |                              |
   +--------------+---------------+
                  |
                  v
        Rendering Engine
                  |
                  v
              Display
```

---

# 7. Dependency Diagram

```text
UI
 |
 v
Feature Layer
 |
 v
CAD Kernel
 |
 +-----------------------------+
 |      |        |             |
 v      v        v             v
Sketch Constraint Solid Selection
        |
        v
 Rendering
```

Dependencies are unidirectional.

Rendering must never invoke modeling logic.

---

# 8. Performance Goals

- 120 FPS on supported devices
- Low memory allocations
- Incremental redraw
- Efficient spatial indexing
- Lazy object updates

---

# 9. Extensibility

The architecture shall support future modules including:

- Assembly Engine
- Simulation Engine
- CAM Engine
- Drawing Engine
- Plugin System
- Cloud Synchronization

without requiring changes to the CAD Kernel public API.

---

# 10. Security

All project files shall be validated before loading.

Future encrypted project support may be added.

---

# 11. Future Native Layer

Performance-critical components may be implemented in C++ through the Android NDK.

Examples:

- Geometry calculations
- Constraint solver
- Boolean operations
- Mesh generation

The Kotlin layer should interact through stable interfaces.

---

# 12. Decision Summary

The CAD Engine will follow a modular architecture centered around the CAD Kernel.

Each engine is independent, testable, and replaceable.

The architecture prioritizes scalability, maintainability, and long-term evolution over short-term implementation speed.

---

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT