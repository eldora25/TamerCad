# ADR-0013 — Command System Architecture

## 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0013 |
| Document Type | Architecture Decision Record |
| Title | Command System Architecture |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Last Updated | 2026-07-31 |
| Next Review | 2027-01-31 |
| Project | TamerCAD |
| Module | Command System |
| Related Documents | ADR-0003, ADR-0004, ADR-0009, ADR-0012 |

---

# 2. Purpose

This ADR defines the architecture of the TamerCAD Command System.

The Command System SHALL provide a unified execution model for all
user-driven and system-driven operations.

The system SHALL become the foundation for:

- Undo / Redo
- History recording
- Macro recording
- Feature operations
- Transactions
- Automation
- Future collaboration

---

# 3. Scope

The Command System SHALL define:

- Command lifecycle
- Command execution
- Undo mechanism
- Redo mechanism
- Command serialization
- Transaction grouping
- Command history integration
- Command validation
- Command events

---

# 4. Non-Goals

The Command System MUST NOT:

- Directly render graphics
- Store project files
- Solve geometry
- Manage UI widgets
- Replace History Engine

The Command System provides operations.

The History Engine stores their evolution.

---

# 5. Definitions

## Command

A self-contained operation that changes system state.

Example:

```text
Create Line
Move Object
Delete Feature
Change Parameter
```

---

## Execute

Applying a command.

```text
Before

    │

 Execute

    ▼

After
```

---

## Undo

Reversing a previously executed command.

---

## Redo

Re-applying an undone command.

---

## Transaction

A group of commands treated as a single operation.

Example:

```text
Create Sketch

├── Create Line
├── Create Circle
└── Add Constraint
```

---

# 6. Problem Statement

CAD applications contain thousands of operations.

Without a centralized command architecture:

- Undo becomes unreliable.
- History becomes inconsistent.
- Automation becomes difficult.
- Features duplicate logic.
- Collaboration becomes impossible.

A professional CAD system requires every modification to be represented
as a command.

---

# 7. Decision

TamerCAD SHALL use a Command Pattern based architecture.

Every state-changing operation MUST be represented as a Command object.

Commands SHALL implement a common interface.

Example:

```text
Command

├── Execute()
├── Undo()
├── Redo()
├── Validate()
└── Serialize()
```

---

# 8. Command Lifecycle

```text
Create Command

       │

       ▼

Validate

       │

       ▼

Execute

       │

       ▼

Record History

       │

       ▼

Notify Systems
```

---

# 9. High-Level Architecture

```text
                 User Action

                      │

                      ▼

              Command Manager

                      │

        ┌─────────────┼─────────────┐

        ▼             ▼             ▼

   Execute       Undo Stack     Redo Stack

        │             │             │

        └─────────────┼─────────────┘

                      ▼

              History Engine

                      │

                      ▼

                CAD Kernel
```

---

# 10. Command Flow

```text
Input Event

      │

      ▼

Tool

      │

      ▼

Create Command

      │

      ▼

Command Manager

      │

      ▼

Execute

      │

      ▼

History Engine
```

---

# 11. Module Dependencies

```text
Input System

      │

      ▼

Command System

      │

      ▼

History Engine

      │

      ▼

CAD Kernel

      │

      ▼

Feature Modules
```

Circular dependencies MUST NOT exist.

---

# 12. Internal Components

```text
Command System

├── Command Interface
├── Command Manager
├── Command Factory
├── Undo Manager
├── Redo Manager
├── Transaction Manager
├── Command Serializer
├── Validation Engine
└── Event Dispatcher
```

---

# 13. Command Interface

Every command SHALL implement:

```text
ICommand

├── Execute()
├── Undo()
├── Redo()
├── Validate()
├── Serialize()
├── Deserialize()
└── GetDescription()
```

---

# 14. Command Example

Example:

```text
Move Entity Command

Data:

├── Entity ID
├── Old Position
└── New Position


Execute()

Old Position
      │
      ▼
New Position


Undo()

New Position
      │
      ▼
Old Position
```

---

# 15. Command Categories

Commands SHALL be grouped.

```text
Commands

├── Sketch Commands
│
├── Modeling Commands
│
├── Constraint Commands
│
├── View Commands
│
├── File Commands
│
└── System Commands
```

---

# End of Part 1

Continue with:

ADR-0013 Part 2 / 3

Sections:

16. Undo/Redo Architecture
17. Transaction System
18. History Integration
19. Command Serialization
20. Macro Recording
21. Event System
22. Performance Requirements
# 16. Undo / Redo Architecture

The Command System SHALL provide a centralized Undo / Redo mechanism.

Undo and Redo operations SHALL NOT directly modify application state.

Instead, they SHALL execute inverse command operations.

Architecture:

```text
                Command Manager

                       │

        ┌──────────────┴──────────────┐

        ▼                             ▼

   Undo Stack                    Redo Stack

        │                             │

        ▼                             ▼

 Previous Commands              Reverted Commands
```

---

# 17. Undo Stack

The Undo Stack SHALL contain successfully executed commands.

Example:

```text
Undo Stack

Top

│
▼

Move Object

Change Parameter

Create Feature

Bottom
```

Rules:

- Failed commands MUST NOT enter the stack.
- Empty commands MUST NOT be recorded.
- Stack size MAY be configurable.

---

# 18. Redo Stack

The Redo Stack SHALL contain commands removed by Undo.

Example:

```text
Undo

Command A

        │

        ▼

Redo Stack
```

When a new command is executed:

```text
New Command

        │

        ▼

Clear Redo Stack
```

---

# 19. Transaction System

The Command System SHALL support transactions.

A transaction groups multiple commands into one logical action.

Example:

```text
Create Rectangle

Transaction

├── Create Line
├── Create Line
├── Create Line
├── Create Line
└── Apply Constraints
```

User experience:

```text
Undo

removes entire Rectangle operation
```

instead of individual lines.

---

# 20. Transaction Architecture

```text
Transaction Manager

          │

          ▼

 Command Group

          │

 ┌────────┼────────┐

 ▼        ▼        ▼

Cmd A   Cmd B    Cmd C

          │

          ▼

 History Engine
```

---

# 21. Transaction Rules

Transactions SHALL:

- Have unique identifiers.
- Contain ordered commands.
- Support rollback.
- Support serialization.
- Support nested operations where possible.

Transactions MUST NOT create circular dependencies.

---

# 22. History Engine Integration

The Command System SHALL communicate with the History Engine.

Relationship:

```text
Command System

       │

       ▼

Executed Command

       │

       ▼

History Engine

       │

       ▼

Project File (.tcad)
```

---

# 23. History Recording Rules

Only successful commands SHALL be recorded.

Each history entry SHALL contain:

```text
History Entry

├── Command ID
├── Timestamp
├── Author
├── Parameters
├── Previous State
├── New State
└── Transaction ID
```

---

# 24. Command Serialization

Commands SHALL be serializable.

Purpose:

- History persistence
- Macro recording
- Collaboration
- Debugging

Example:

```json
{
 "command": "MoveEntity",
 "entity": "UUID-1234",
 "from": [0,0],
 "to": [10,10]
}
```

---

# 25. Command Deserialization

Serialized commands SHALL be converted back into executable commands.

Pipeline:

```text
Serialized Command

        │

        ▼

Command Factory

        │

        ▼

Command Object

        │

        ▼

Execute
```

Unknown commands SHALL fail safely.

---

# 26. Macro Recording

The Command System SHALL provide the foundation for macro recording.

Architecture:

```text
User Actions

      │

      ▼

Commands

      │

      ▼

Macro Recorder

      │

      ▼

Macro File
```

A macro SHALL contain:

- Command sequence
- Parameters
- Timing information
- Metadata

---

# 27. Event System

The Command System SHALL publish command lifecycle events.

Events:

```text
CommandCreated

CommandValidated

CommandExecuted

CommandUndone

CommandRedone

CommandFailed
```

---

# 28. Command Event Flow

```text
Create Command

        │

        ▼

Validate Event

        │

        ▼

Execute Event

        │

        ▼

History Event

        │

        ▼

UI Update Event
```

---

# 29. Performance Requirements

The Command System SHOULD:

- Execute commands with minimal overhead.
- Avoid unnecessary state duplication.
- Support large histories.
- Process undo operations quickly.

Targets:

```text
Command Execution

< 5 ms


Undo / Redo

< 10 ms
```

---

# 30. Memory Management

Large CAD operations may create large states.

The system SHOULD support:

- State compression
- Delta storage
- Checkpoints
- Lazy loading

Example:

```text
History

├── Full Snapshot
│
├── Delta 1
│
├── Delta 2
│
└── Delta 3
```

---

# 31. Threading Model

The Command System SHALL define execution ownership.

Default:

```text
Main Thread

      │

      ▼

Command Manager

      │

      ▼

CAD Kernel
```

Future versions MAY support:

- Background computation
- Distributed commands
- Collaborative execution

---

# 32. Error Handling

Failed commands SHALL:

- Report errors.
- Restore previous state.
- Avoid history insertion.
- Notify subscribers.

Example:

```text
Execute

   │

   ▼

Failure

   │

   ▼

Rollback

   │

   ▼

Notify Error
```

---

# End of Part 2

Continue with:

ADR-0013 Part 3 / 3

Sections:

33. Security Considerations
34. Risks
35. Future Work
36. Related ADRs
37. Affected Modules
38. Implementation Checklist
39. Acceptance Criteria
40. Quality Attributes
41. Open Questions
42. Revision History
43. Decision Summary
44. Approval
# 33. Security Considerations

The Command System SHALL validate every command before execution.

Commands represent state-changing operations and therefore MUST be
treated as controlled operations.

Security principles:

- Commands MUST NOT bypass the CAD Kernel.
- Commands MUST validate input parameters.
- Serialized commands MUST be verified before execution.
- External commands MUST require authorization.
- Plugin commands MUST operate within defined permissions.

---

# 34. Command Validation Pipeline

```text
Incoming Command

        │

        ▼

Parameter Validation

        │

        ▼

Permission Check

        │

        ▼

Dependency Validation

        │

        ▼

Execute Command
```

Invalid commands SHALL be rejected before modifying system state.

---

# 35. Plugin Command Support

The Command System SHALL support extension through plugins.

Plugin commands MUST implement:

```text
ICommand

├── Execute()
├── Undo()
├── Validate()
├── Serialize()
└── Metadata()
```

Plugin commands SHALL declare:

```text
Plugin Command

├── Plugin ID
├── Command ID
├── Version
├── Permissions
└── Dependencies
```

---

# 36. Risks

Potential risks:

- Large undo history memory usage
- Complex transaction rollback
- Command version incompatibility
- Plugin command conflicts
- Invalid serialized commands
- Performance degradation

Mitigation strategies:

- Delta-based history storage
- Command validation
- Versioned commands
- Transaction isolation
- Automated command testing

---

# 37. Future Work

Planned improvements:

- Distributed command execution
- Collaborative command synchronization
- Cloud history storage
- AI-generated commands
- Natural language command interface
- Visual macro editor
- Command marketplace
- Command dependency graph
- Advanced replay system

---

# 38. Command Dependency Graph

Future versions MAY represent commands as a dependency graph.

Example:

```text
Create Sketch

      │

      ▼

Create Extrusion

      │

      ▼

Apply Fillet

      │

      ▼

Create Pattern
```

This enables:

- Dependency analysis
- Intelligent updates
- Partial recomputation

---

# 39. Related ADRs

- ADR-0003 — CAD Engine Architecture
- ADR-0004 — Parametric Modeling
- ADR-0005 — Sketch Engine
- ADR-0006 — Constraint Engine
- ADR-0009 — History Engine
- ADR-0010 — Selection Engine
- ADR-0011 — Input System
- ADR-0012 — Project File Format

---

# 40. Affected Modules

```text
core/command

├── command-manager
├── undo-manager
├── redo-manager
├── transaction-manager
├── serializer
└── validation

core/history

core/kernel

feature/sketch

feature/modeling

plugins

automation
```

---

# 41. Implementation Checklist

## Core Command Infrastructure

- [ ] ICommand interface
- [ ] Command Manager
- [ ] Command Factory
- [ ] Command Registry
- [ ] Command Validator

---

## Undo / Redo

- [ ] Undo Stack
- [ ] Redo Stack
- [ ] History synchronization
- [ ] Memory optimization

---

## Transactions

- [ ] Transaction Manager
- [ ] Nested transactions
- [ ] Rollback mechanism
- [ ] Transaction serialization

---

## Persistence

- [ ] Command serialization
- [ ] Command deserialization
- [ ] Version compatibility
- [ ] Migration support

---

## Automation

- [ ] Macro recorder
- [ ] Macro player
- [ ] Command scripting API

---

## Testing

- [ ] Command unit tests
- [ ] Undo/Redo tests
- [ ] Transaction tests
- [ ] Serialization tests
- [ ] Performance tests
- [ ] Plugin command tests

---

# 42. Acceptance Criteria

The Command System SHALL be considered complete when:

- [ ] Every state-changing operation uses commands.
- [ ] Undo and Redo work reliably.
- [ ] Commands can be serialized.
- [ ] Commands integrate with History Engine.
- [ ] Transactions operate correctly.
- [ ] Failed commands rollback safely.
- [ ] Plugin commands are supported.
- [ ] Automated tests pass.

---

# 43. Quality Attributes

| Attribute | Rating | Notes |
|-----------|:------:|-------|
| Performance | 5 | Optimized execution pipeline |
| Scalability | 5 | Supports large command histories |
| Maintainability | 5 | Centralized operation model |
| Testability | 5 | Deterministic command lifecycle |
| Reliability | 5 | Transaction rollback support |
| Extensibility | 5 | Plugin-ready architecture |
| Security | 5 | Validation-first execution |

---

# 44. Open Questions

- [ ] Should commands support distributed execution?
- [ ] Should users be able to edit command history manually?
- [ ] Should command scripts use a dedicated language?
- [ ] Should AI-generated commands require approval?
- [ ] Should command history be synchronized in real-time collaboration?

These questions SHALL be evaluated before advanced collaboration
features.

---

# 45. Revision History

| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 46. Decision Summary

TamerCAD SHALL adopt a centralized Command System architecture.

All state-changing operations SHALL be represented as commands.

The Command System SHALL provide:

- Execution model
- Undo / Redo
- Transactions
- Serialization
- Macro foundation
- Plugin extension support

This architecture establishes the foundation for a professional CAD
workflow where every operation is traceable, reversible and extensible.

---

# 47. Approval

Approved By

Project Founder

Pardus26

Architecture Assistant

ChatGPT

Approval Date

2026-07-31

Document Status

Accepted