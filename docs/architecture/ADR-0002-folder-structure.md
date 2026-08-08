# ADR-0002 — Project Folder Structure

- **Status:** Accepted
- **Date:** 2026-07-31
- **Version:** 0.1.0-alpha
- **Project:** TamerCAD

---

# 1. Purpose

This document defines the official folder structure of the TamerCAD project.

The objective is to ensure that every source file has a predictable location and that the project remains maintainable as it grows into a professional CAD platform.

The folder structure is designed to support modular development, independent testing, and future expansion without major refactoring.

---

# 2. Architectural Principles

The folder structure follows these principles:

- Clean Architecture
- Feature-first organization where appropriate
- Separation of concerns
- High cohesion
- Low coupling
- Scalability
- Readability

---

# 3. Root Directory Structure

```text
TamerCAD/
│
├── app/
├── core/
├── data/
├── domain/
├── feature/
├── ui/
├── docs/
├── gradle/
├── scripts/
├── tools/
├── .github/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── README.md
├── CHANGELOG.md
├── ROADMAP.md
└── LICENSE
```

---

# 4. app/

The Android application module.

Responsibilities:

- Application entry point
- AndroidManifest
- Dependency injection initialization
- Activity hosting
- Navigation bootstrap

This module should contain as little business logic as possible.

---

# 5. core/

Contains reusable infrastructure shared by the entire project.

Subdirectories:

```text
core/
│
├── geometry/
├── math/
├── kernel/
├── rendering/
├── constraints/
├── sketch/
├── solid/
├── selection/
├── history/
├── commands/
├── project/
├── export/
├── import/
├── preferences/
├── logging/
├── utils/
└── extensions/
```

No Android-specific code should exist inside this module unless absolutely required.

---

# 6. domain/

Contains business rules.

Examples:

- Use Cases
- Repository Interfaces
- Domain Models
- Validation Rules

The domain layer must remain independent of Android.

---

# 7. data/

Responsible for data sources.

Examples:

- Room Database
- File Storage
- Preferences
- Importers
- Exporters
- Repository Implementations

---

# 8. feature/

Each user-facing feature lives in its own module or package.

Example:

```text
feature/
│
├── home/
├── project/
├── sketch/
├── modeling/
├── constraints/
├── dimensions/
├── selection/
├── transform/
├── export/
├── import/
├── settings/
└── about/
```

Each feature should contain:

```text
presentation/
domain/
data/
ui/
```

when complexity justifies it.

---

# 9. ui/

Shared UI resources.

Examples:

- Theme
- Typography
- Colors
- Components
- Icons
- Dialogs
- Animations

---

# 10. docs/

Project documentation.

Structure:

```text
docs/
│
├── architecture/
├── api/
├── design/
├── releases/
├── decisions/
└── user-guide/
```

---

# 11. scripts/

Automation scripts.

Examples:

- Release scripts
- Version update scripts
- Code generation
- Build automation

---

# 12. tools/

Developer tools.

Examples:

- Geometry converters
- CAD utilities
- Internal debugging tools

---

# 13. .github/

GitHub configuration.

Examples:

```text
.github/
│
├── workflows/
├── ISSUE_TEMPLATE/
├── PULL_REQUEST_TEMPLATE.md
└── CODEOWNERS
```

---

# 14. Naming Rules

Folders:

- lowercase
- no spaces
- singular names when possible

Examples:

geometry

constraint

rendering

Never:

GeometryEngine

Geometry Folder

My Geometry

---

# 15. File Naming Rules

Examples:

SketchCanvas.kt

ConstraintSolver.kt

ProjectRepository.kt

MainActivity.kt

Always use PascalCase for Kotlin source files.

---

# 16. Scalability

The folder structure must support:

- 1,000+ Kotlin files
- Multiple Gradle modules
- Native C++ integration
- Rendering backends
- Plugin system
- Future desktop support

without restructuring existing packages.

---

# 17. Future Modularization

When project size requires it, modules may become independent Gradle modules.

Example:

```text
:core:geometry
:core:math
:core:kernel
:feature:sketch
:feature:modeling
:feature:export
```

The logical package layout defined in this document should remain stable.

---

# 18. Decision

This folder structure is adopted as the official structure of the TamerCAD project.

New folders should only be introduced when they follow the architectural principles defined in ADR-0001 and this document.

---

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT