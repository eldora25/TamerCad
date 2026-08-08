# ADR-0011 — Input System Architecture

## 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0011 |
| Document Type | Architecture Decision Record |
| Title | Input System Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Last Updated | 2026-07-31 |
| Next Review | 2027-01-31 |
| Project | TamerCAD |
| Module | Input System |
| Related Documents | ADR-0003, ADR-0005, ADR-0008, ADR-0010 |

---

# 2. Purpose

This ADR defines the architecture of the Input System.

The Input System SHALL provide a unified abstraction layer for every
supported input device.

CAD tools SHALL receive normalized input events instead of interacting
directly with platform-specific APIs.

The architecture SHALL support future expansion without requiring
changes to existing tools.

---

# 3. Scope

The Input System SHALL support:

- Stylus
- Touch
- Mouse
- Keyboard
- Trackpad
- Gesture recognition
- Input mapping
- Shortcut management
- Input events
- Device capability detection

Future versions MAY support:

- 3D SpaceMouse devices
- Game controllers
- XR controllers
- Eye tracking
- Voice commands

---

# 4. Non-Goals

The Input System MUST NOT:

- Render graphics
- Execute CAD commands
- Modify geometry
- Manage project files
- Solve constraints

---

# 5. Definitions

**Input Event**

A normalized event produced by any supported device.

**Pointer**

A generic pointing source such as a stylus, mouse or touch contact.

**Gesture**

A high-level interaction derived from multiple low-level input events.

**Shortcut**

A keyboard or device-specific command mapping.

---

# 6. Problem Statement

Modern CAD applications must support multiple input devices
simultaneously.

Without a unified abstraction layer:

- Tools become platform-dependent.
- Device-specific code is duplicated.
- Maintenance cost increases.
- New hardware becomes difficult to support.

---

# 7. Decision

A dedicated Input System SHALL normalize all input before forwarding it
to the CAD Kernel.

CAD tools MUST consume normalized events only.

Platform-specific APIs SHALL remain isolated within adapter modules.

---

# 8. Alternatives Considered

## Alternative A — Direct Platform APIs

Pros

- Minimal implementation effort

Cons

- Tight platform coupling
- Difficult portability
- Duplicate logic

---

## Alternative B — Tool-specific Input Handling

Pros

- Simple prototype

Cons

- Inconsistent behavior
- High maintenance cost
- Poor scalability

---

## Chosen Solution

Unified Input System with device adapters.

---

# 9. Rationale

The unified architecture:

- Improves maintainability.
- Enables cross-platform support.
- Simplifies testing.
- Allows future hardware integration.
- Keeps CAD tools hardware-independent.

---

# 10. High-Level Architecture

```text
                  Input System
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
 Device Adapters   Gesture Engine   Shortcut Manager
      │                  │                  │
      └──────────────────┼──────────────────┘
                         ▼
                   Event Dispatcher
                         │
                         ▼
                     CAD Kernel
```

---

# 11. Data Flow

```text
Input Device
      │
      ▼
Platform Adapter
      │
      ▼
Normalizer
      │
      ▼
Gesture Engine
      │
      ▼
Event Dispatcher
      │
      ▼
CAD Kernel
```

---

# 12. Module Dependencies

```text
Android Platform
        │
        ▼
Input Adapters
        │
        ▼
Input System
        │
        ▼
CAD Kernel
        │
        ▼
Feature Tools
```

Dependencies SHALL remain acyclic.

---

# 13. Internal Components

```text
Input System

├── Input Manager
├── Device Manager
├── Event Dispatcher
├── Event Queue
├── Gesture Engine
├── Shortcut Manager
├── Pointer Tracker
├── Stylus Manager
├── Touch Manager
├── Mouse Manager
├── Keyboard Manager
└── Device Capability Detector
```

---

# 14. Supported Devices

Phase 1

- Stylus
- Touch
- Mouse
- Keyboard

Phase 2

- Trackpad
- External Keyboard

Phase 3

- SpaceMouse
- XR Controllers
- Voice Commands

---

# 15. Input Normalization

All hardware events SHALL be converted into a common event format.

```text
Platform Event
      │
      ▼
Device Adapter
      │
      ▼
Normalized Input Event
      │
      ▼
CAD Tool
```

Normalized events SHALL include:

- Device Type
- Timestamp
- Position
- Pressure (if available)
- Tilt (if available)
- Button State
- Modifier Keys

---

# 16. Gesture Engine

The Gesture Engine SHALL recognize:

- Tap
- Double Tap
- Long Press
- Drag
- Pan
- Pinch Zoom
- Rotate
- Two-finger Pan
- Multi-touch Drag

Gesture recognition SHALL be device-independent.

---

# 17. Performance Targets

The Input System SHOULD:

- Process input latency below 2 ms.
- Avoid unnecessary allocations.
- Support simultaneous input sources.
- Handle high-frequency stylus events.

Target:

- Event dispatch latency < 1 ms
- Gesture recognition latency < 2 ms

---

# End of Part 1

Continue with:

ADR-0011 Part 2

Sections:

18. Public API
19. Stylus Support
20. Keyboard Shortcuts
21. Event Model
22. Security Considerations
23. Risks
24. Future Work
25. Related ADRs
26. Affected Modules
27. Implementation Checklist
28. Acceptance Criteria
29. Quality Attributes
30. Open Questions
31. Revision History
32. Decision Summary
33. Approval
# 18. Public API

The Input System SHALL expose all functionality exclusively through the
CAD Kernel.

Feature modules MUST consume normalized input events only.

Minimum public API responsibilities:

- Register Device
- Unregister Device
- Query Connected Devices
- Dispatch Input Event
- Register Gesture Handler
- Register Shortcut
- Enable Device
- Disable Device
- Get Device Capabilities
- Subscribe Input Events

The API SHALL remain platform-independent.

---

# 19. Stylus Support

Stylus input SHALL be treated as a first-class interaction device.

Supported capabilities:

- Position
- Pressure
- Tilt X
- Tilt Y
- Azimuth
- Altitude
- Barrel Button
- Eraser
- Hover (when supported)

Example event:

```text
Stylus Event

├── Position
├── Pressure
├── Tilt
├── Rotation
├── Button State
├── Hover State
└── Timestamp
```

Unavailable hardware capabilities SHALL gracefully fall back to default
values.

---

# 20. Keyboard Shortcuts

The Shortcut Manager SHALL provide configurable shortcut mappings.

Supported categories:

- File
- Edit
- View
- Sketch
- Modeling
- Camera
- Selection
- Debug

Example:

```text
Shortcut

Ctrl + Z  -> Undo
Ctrl + Y  -> Redo
Ctrl + A  -> Select All
Delete    -> Delete Selection
Space     -> Confirm Tool
Esc        -> Cancel Tool
```

Shortcut profiles SHOULD be user-configurable in future versions.

---

# 21. Event Model

All input SHALL be represented using immutable events.

```text
Input Event

├── Event ID
├── Device ID
├── Device Type
├── Timestamp
├── Event Type
├── Position
├── Pressure
├── Modifiers
├── Buttons
└── Metadata
```

Events SHALL be processed in chronological order.

Event consumers SHALL NOT modify received event objects.

---

# 22. Device Capability Detection

The Input System SHALL detect available hardware capabilities during
startup and whenever devices are connected or disconnected.

Detected capabilities MAY include:

- Pressure sensitivity
- Tilt support
- Hover support
- Multi-touch support
- Keyboard availability
- Pointer precision
- Scroll wheel support

Example:

```text
Device

├── Identifier
├── Vendor
├── Model
├── Capabilities
└── Status
```

---

# 23. Security Considerations

The Input System SHALL validate all incoming platform events.

Malformed events MUST be rejected.

Input injection from untrusted sources MUST NOT bypass validation.

Future plugin-generated input SHALL be verified by the CAD Kernel before
dispatch.

---

# 24. Risks

Potential risks:

- Event flooding
- Input latency
- Platform inconsistencies
- Unsupported hardware
- Gesture conflicts

Mitigation strategies:

- Event throttling
- Input buffering
- Platform abstraction
- Capability detection
- Comprehensive testing

---

# 25. Future Work

Planned enhancements:

- SpaceMouse support
- XR controller support
- Voice command interface
- Eye tracking
- Haptic feedback
- User-defined gestures
- Macro-trigger shortcuts
- Multi-device synchronization
- Remote input devices
- AI-assisted gesture recognition

---

# 26. Related ADRs

- ADR-0003 — CAD Engine Architecture
- ADR-0005 — Sketch Engine
- ADR-0008 — Rendering Engine
- ADR-0009 — History Engine
- ADR-0010 — Selection Engine

---

# 27. Affected Modules

```text
core/input
core/kernel
core/events
core/gestures
core/shortcuts
feature/sketch
feature/modeling
ui
```

---

# 28. Implementation Checklist

## Core

- [ ] InputManager
- [ ] DeviceManager
- [ ] EventDispatcher
- [ ] EventQueue

## Device Adapters

- [ ] StylusAdapter
- [ ] TouchAdapter
- [ ] MouseAdapter
- [ ] KeyboardAdapter

## Gestures

- [ ] Tap recognition
- [ ] Drag recognition
- [ ] Pinch recognition
- [ ] Rotation recognition

## Shortcuts

- [ ] Shortcut registry
- [ ] Configurable mappings
- [ ] Conflict detection

## Performance

- [ ] Input buffering
- [ ] Allocation optimization
- [ ] Latency profiling

## Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] Multi-touch tests
- [ ] Stylus tests
- [ ] Performance benchmarks

---

# 29. Acceptance Criteria

- [ ] All supported devices generate normalized events.
- [ ] CAD tools remain platform-independent.
- [ ] Public API is documented.
- [ ] Event ordering is deterministic.
- [ ] No circular module dependencies exist.
- [ ] Performance targets are achieved.
- [ ] Automated tests pass.

---

# 30. Quality Attributes

| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Performance | 5 | Low-latency event pipeline |
| Scalability | 5 | Adapter-based architecture |
| Maintainability | 5 | Clear separation of responsibilities |
| Testability | 5 | Deterministic immutable events |
| Reliability | 5 | Validation and capability detection |
| Extensibility | 5 | New devices via adapters |
| Security | 4 | Event validation and trusted dispatch |

---

# 31. Open Questions

- [ ] Should users be able to create custom gesture recognizers?
- [ ] Should shortcut profiles be shared between devices?
- [ ] How should simultaneous stylus and touch interactions be prioritized?
- [ ] Should pressure sensitivity be customizable per tool?
- [ ] Should remote input streaming be supported?

These questions SHALL be reviewed before implementation of advanced
input features.

---

# 32. Revision History

| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 33. Decision Summary

The Input System is adopted as the unified abstraction layer for all
user interaction devices within TamerCAD.

All hardware-specific events SHALL be normalized before reaching CAD
tools, ensuring portability, consistency and long-term maintainability.

The adapter-based architecture enables future support for emerging
devices without requiring changes to existing tool implementations.

---

# 34. Approval

Approved By

Project Founder

Pardus26

Architecture Assistant

ChatGPT

Approval Date

2026-07-31

Document Status

Accepted