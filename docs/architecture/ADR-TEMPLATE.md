# Architecture Decision Record (ADR) Template

> **Document Type:** Template
>
> This template defines the mandatory structure, formatting rules, and
> documentation standards for all Architecture Decision Records (ADRs)
> in the TamerCAD project.
>
> Every ADR **MUST** follow this template unless an explicit exception
> has been approved by the Architecture Review Board.

---

# 1. Document Metadata

| Field | Value |
|--------|-------|
| Document ID | TCAD-ADR-XXXX |
| Document Type | Architecture Decision Record |
| Title | |
| Status | Draft / Proposed / Accepted / Deprecated / Superseded |
| Version | |
| Author | |
| Reviewer | |
| Approved By | |
| Created | YYYY-MM-DD |
| Last Updated | YYYY-MM-DD |
| Next Review | YYYY-MM-DD |
| Project | TamerCAD |
| Module | |
| Related Documents | |

---

# 2. Purpose

Describe why this ADR exists.

Explain the architectural problem that requires a decision.

---

# 3. Scope

Clearly define what is covered.

Clearly define what is NOT covered.

---

# 4. Non-Goals

List responsibilities that explicitly belong to other modules.

---

# 5. Definitions

Define all important technical terms.

Example:

- Scene
- Sketch
- Constraint
- Transaction
- Feature
- Workspace

---

# 6. Problem Statement

Describe:

- Existing limitations
- Risks
- Engineering challenges
- Performance concerns
- Scalability concerns

---

# 7. Decision

Describe the adopted solution.

Normative language SHALL follow RFC 2119.

Examples:

- MUST
- MUST NOT
- SHOULD
- SHOULD NOT
- MAY

---

# 8. Alternatives Considered

Document every major alternative.

Example:

Alternative A

Pros

Cons

Alternative B

Pros

Cons

Explain why the chosen solution was selected.

---

# 9. Rationale

Explain the engineering reasoning.

Discuss trade-offs.

Include expected long-term benefits.

---

# 10. High-Level Architecture

Provide an ASCII architecture diagram.

Example

```text
Module A
    │
    ▼
Module B
    │
    ▼
Module C
```

Diagrams SHOULD also be compatible with PlantUML.

---

# 11. Data Flow

Illustrate runtime data flow.

```text
Input
 │
 ▼
Processing
 │
 ▼
Output
```

---

# 12. Module Dependencies

Illustrate dependencies.

Circular dependencies MUST NOT exist.

---

# 13. Internal Components

Describe internal subsystems.

Example

```text
Subsystem

├── Component A
├── Component B
└── Component C
```

---

# 14. Public API Impact

Document all public APIs.

Document compatibility expectations.

Breaking changes MUST be justified.

---

# 15. Persistence / Serialization

If applicable, describe:

- Storage
- Serialization
- Versioning
- Migration

---

# 16. Performance Targets

Document measurable objectives.

Example:

- FPS
- Memory
- CPU
- GPU
- Startup
- Latency

Targets SHOULD be measurable.

---

# 17. Security Considerations

Discuss:

- Validation
- Integrity
- Trust boundaries
- Attack surface

---

# 18. Risks

Document known risks.

Provide mitigation strategies.

---

# 19. Future Work

List planned future enhancements.

---

# 20. Related ADRs

List all relevant ADRs.

---

# 21. Affected Modules

List affected project modules.

Example

```text
core/kernel
core/rendering
feature/sketch
ui
```

---

# 22. Implementation Checklist

## Core

- [ ]

## API

- [ ]

## UI

- [ ]

## Performance

- [ ]

## Testing

- [ ]

---

# 23. Acceptance Criteria

Example

- [ ] Public APIs documented
- [ ] Unit tests completed
- [ ] No circular dependencies
- [ ] Performance targets achieved
- [ ] Architecture review completed

---

# 24. Quality Attributes

| Attribute | Rating (1–5) | Notes |
|-----------|--------------|-------|
| Performance | | |
| Scalability | | |
| Maintainability | | |
| Testability | | |
| Reliability | | |
| Extensibility | | |
| Security | | |

Every ADR SHOULD evaluate its expected quality characteristics.

---

# 25. Open Questions

Document unresolved architectural questions.

Example

- [ ]
- [ ]
- [ ]

---

# 26. Revision History

| Version | Date | Description |
|----------|------|-------------|
| | | |

Every modification SHALL be recorded.

---

# 27. Decision Summary

Summarize the adopted architecture in a concise form.

---

# 28. Approval

Approved By

Architecture Review Board

Project Founder

Lead Architect

Approval Date

Document Status

---

# Appendix A — RFC 2119 Keywords

Normative terms SHALL follow RFC 2119.

- MUST
- MUST NOT
- REQUIRED
- SHALL
- SHALL NOT
- SHOULD
- SHOULD NOT
- RECOMMENDED
- MAY
- OPTIONAL

---

# Appendix B — ASCII Diagram Rules

- Use monospace formatting.
- Keep diagrams readable in plain text.
- Prefer vertical flow.
- Avoid crossing lines where possible.
- PlantUML compatibility SHOULD be considered.

---

# Appendix C — Documentation Rules

- English only.
- Markdown only.
- UTF-8 encoding.
- Unix line endings (LF).
- Maximum line length: 100 characters (recommended).
- Headings SHALL use Markdown ATX style (`#`).
- Code blocks MUST specify a language where applicable.
- Every ADR MUST include all mandatory sections.

---

# Appendix D — Review Checklist

Before approving an ADR, verify:

- [ ] Metadata completed
- [ ] Problem clearly defined
- [ ] Decision justified
- [ ] Alternatives evaluated
- [ ] Diagrams included
- [ ] API impact documented
- [ ] Security reviewed
- [ ] Risks identified
- [ ] Checklist completed
- [ ] Acceptance criteria defined
- [ ] Quality attributes evaluated
- [ ] Revision history updated