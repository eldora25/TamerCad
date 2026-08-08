# ADR-0009 — History Engine Architecture

## Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-0009 |
| Document Type | Architecture Decision Record |
| Status | Accepted |
| Version | 0.1.0-alpha |
| Author | Pardus26 |
| Reviewer | ChatGPT |
| Approved By | Project Founder |
| Created | 2026-07-31 |
| Last Updated | 2026-07-31 |
| Next Review | 2027-01-31 |
| Project | TamerCAD |
| Module | History Engine |

---

# 1. Purpose

This document defines the architecture of the History Engine.

The History Engine SHALL manage every modification performed within a
project, enabling deterministic Undo/Redo operations, transaction
grouping and future macro recording.

The History Engine SHALL become the single source of truth for all
user actions that modify project state.

---

# 2. Scope

The History Engine SHALL manage:

- Undo
- Redo
- Command execution
- Transaction grouping
- Feature history
- Timeline
- Action logging
- Future macro recording

Future versions MAY support:

- Collaborative editing
- Branch history
- Merge history
- Selective undo
- Persistent history snapshots

---

# 3. Non-Goals

The History Engine MUST NOT:

- Render graphics
- Solve constraints
- Generate geometry
- Import or export files
- Store GPU resources

---

# 4. Definitions

**Command**

An executable action that modifies project data.

**Transaction**

A collection of commands executed as one logical operation.

**Undo**

Reverts the latest committed transaction.

**Redo**

Reapplies the previously reverted transaction.

**Timeline**

Chronological list of committed transactions.

---

# 5. Problem Statement

Professional CAD applications perform thousands of user actions.

Without a dedicated History Engine:

- Undo becomes unreliable.
- Commands become tightly coupled.
- Transactions cannot be grouped.
- Macro recording becomes difficult.
- Future collaboration becomes nearly impossible.

---

# 6. Decision

The History Engine SHALL implement the Command Pattern.

Every modification to project data MUST be represented by a Command.

No subsystem SHALL modify project data directly.

---

# 7. Responsibilities

The History Engine SHALL:

- Execute commands
- Store history
- Undo commands
- Redo commands
- Group transactions
- Notify CAD Kernel
- Notify UI
- Record timestamps

---

# 8. High-Level Architecture

```text
                 History Engine
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
 Command Queue     Transaction Log   Timeline
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                    CAD Kernel
```

---

# 9. Command Pattern

```text
User Action
      │
      ▼
Tool
      │
      ▼
Command
      │
      ▼
History Engine
      │
      ▼
CAD Kernel
```

Each Command SHALL expose:

- execute()
- undo()
- redo()

---

# 10. Transaction Lifecycle

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
Commit Transaction
      │
      ▼
Push Timeline
```

---

# 11. Timeline Structure

```text
History

│
├── Transaction 001
│     ├── Command
│     ├── Command
│     └── Command
│
├── Transaction 002
│
├── Transaction 003
│
└── Transaction N
```

---

# 12. Undo / Redo Flow

```text
Undo

Timeline
    │
    ▼
Previous Transaction
    │
    ▼
Undo Commands
    │
    ▼
CAD Kernel
    │
    ▼
Rendering Engine
```

```text
Redo

Timeline
    │
    ▼
Next Transaction
    │
    ▼
Redo Commands
    │
    ▼
CAD Kernel
    │
    ▼
Rendering Engine
```

---

# 13. Module Dependencies

```text
Feature Layer
      │
      ▼
History Engine
      │
      ▼
CAD Kernel
      │
      ▼
Rendering Engine
```

Dependencies SHALL remain acyclic.

---

# 14. Transaction Model

```text
Transaction

├── id
├── timestamp
├── commands
├── description
├── author
├── metadata
└── committed
```

---

# 15. Performance Objectives

The History Engine SHOULD:

- Execute commands with minimal latency.
- Support thousands of transactions.
- Minimize memory usage.
- Allow incremental history cleanup.
- Avoid duplicate object snapshots.

Target:

- Undo latency < 5 ms
- Redo latency < 5 ms

---

# End of Part 1

Continue with:

ADR-0009 Part 2

Sections:

16. Public API
17. Transaction Grouping
18. Memory Management
19. Macro Recording
20. Error Handling
21. Security Considerations
22. Risks
23. Future Work
24. Related ADRs
25. Affected Modules
26. Implementation Checklist
27. Acceptance Criteria
28. Open Questions
29. Revision History
30. Decision Summary
31. Approval

# 16. Public API

The History Engine SHALL expose its functionality exclusively through
the CAD Kernel.

The public API MUST remain implementation-independent.

Minimum API responsibilities:

- Execute Command
- Undo
- Redo
- Begin Transaction
- Commit Transaction
- Rollback Transaction
- Clear History
- Query Timeline
- Query Transaction
- Notify Observers

Public API consumers MUST NOT manipulate the internal timeline directly.

---

# 17. Transaction Grouping

Multiple commands MAY be grouped into a single transaction.

Example:

```text
Create Rectangle

├── Create Line
├── Create Line
├── Create Line
└── Create Line
```

Undo SHALL remove the complete rectangle in one operation.

Nested transactions SHOULD be supported in future versions.

---

# 18. Memory Management

History storage SHALL avoid storing full project snapshots.

Preferred strategy:

```text
History

│
├── Transaction
│      │
│      ├── Command
│      ├── Parameters
│      └── Delta
│
└── Next
```

Only incremental state changes SHOULD be stored.

The engine MAY periodically create checkpoints to reduce replay cost.

---

# 19. Macro Recording

The architecture SHALL support future macro recording.

Workflow:

```text
User Action
      │
      ▼
Command
      │
      ▼
History Engine
      │
      ├──────────────┐
      ▼              ▼
Timeline      Macro Recorder
```

Recorded macros SHALL consist of serialized commands.

---

# 20. Error Handling

The History Engine SHALL detect:

- Invalid commands
- Transaction failures
- Rollback failures
- Timeline corruption
- Replay failures

The engine MUST preserve project consistency even if command execution
fails.

Partial commits SHALL NOT occur.

---

# 21. Security Considerations

History data SHALL be validated before replay.

Serialized commands MUST be version-aware.

Future cloud synchronization SHALL verify transaction integrity before
merging remote changes.

History replay MUST reject malformed or incompatible command payloads.

---

# 22. Risks

Potential risks:

- Excessive memory consumption
- Long replay times
- Corrupted timelines
- Recursive command execution
- Transaction deadlocks

Mitigation strategies:

- Delta storage
- Checkpoints
- Transaction validation
- Replay verification
- Command execution guards

---

# 23. Future Work

Planned enhancements include:

- Macro editor
- Action replay
- Timeline visualization
- Persistent undo history
- Branch history
- Collaborative editing
- Conflict resolution
- Selective undo
- Time-travel debugging
- Session recovery

---

# 24. Related ADRs

- ADR-0001 — Project Architecture
- ADR-0002 — Folder Structure
- ADR-0003 — CAD Engine Architecture
- ADR-0004 — Parametric Modeling
- ADR-0005 — Sketch Engine
- ADR-0006 — Constraint Engine
- ADR-0007 — Dimension Engine
- ADR-0008 — Rendering Engine

---

# 25. Affected Modules

```text
core/history
core/kernel
core/project
core/serialization
feature/sketch
feature/modeling
ui
```

---

# 26. Implementation Checklist

## Core

- [ ] Command interface
- [ ] Command dispatcher
- [ ] Timeline manager
- [ ] Transaction manager
- [ ] Delta storage

## Undo / Redo

- [ ] Undo stack
- [ ] Redo stack
- [ ] Transaction replay
- [ ] Rollback support

## Macro Support

- [ ] Serializable commands
- [ ] Macro recorder hooks
- [ ] Replay engine

## Performance

- [ ] Incremental history storage
- [ ] Checkpoint system
- [ ] History pruning policy

## Testing

- [ ] Unit tests
- [ ] Undo/Redo integration tests
- [ ] Stress tests
- [ ] Replay consistency tests
- [ ] Memory usage benchmarks

---

# 27. Acceptance Criteria

- [ ] Every model modification is represented by a Command.
- [ ] Undo restores the previous project state correctly.
- [ ] Redo reapplies reverted transactions correctly.
- [ ] Transactions are atomic.
- [ ] No circular command execution occurs.
- [ ] Public API is documented.
- [ ] Performance targets are achieved.
- [ ] All automated tests pass.

---

# 28. Open Questions

- [ ] Should undo history survive application restarts?
- [ ] Should history be shared between collaborators?
- [ ] What is the maximum supported history depth?
- [ ] Should macro playback support parameter substitution?
- [ ] Should users be allowed to edit the timeline?

These questions SHALL be reviewed before the implementation of
collaborative editing and cloud synchronization.

---

# 29. Revision History

| Version | Date | Description |
|---------|------------|--------------------------------|
| 0.1.0-alpha | 2026-07-31 | Initial architecture document |

---

# 30. Decision Summary

The History Engine is adopted as the authoritative subsystem for
tracking and replaying all project modifications.

All state-changing operations SHALL be represented as Commands and
executed through transactional workflows.

This design provides deterministic Undo/Redo behavior, enables future
macro recording, supports scalable collaboration features and preserves
project integrity.

---

# 31. Approval

Approved by

Project Founder

Pardus26

Architecture Assistant

ChatGPT

Approval Date

2026-07-31

Document Status

Accepted