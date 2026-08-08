# TamerCAD UI Redesign - Step 5: Create Tools

This plan modernizes the "Create" tool category in TamerCad. It introduces a professional `ToolDefinition` system to manage tool metadata (labels, icons, commands, and states) and ensures that advanced features are correctly represented even if they are not yet fully implemented in the CAD kernel.

## User Review Required

> [!IMPORTANT]
> **No Fake CAD Operations**: Tools that are not yet implemented in the kernel will be displayed as `disabled`.
> **Extrude & Revolve**: These are the primary tools currently supported by the UI/Kernel interaction.
> **Advanced Tools**: Sweep, Loft, Hole, Thread, Emboss, and Rib will be added to the UI but marked as disabled/coming soon.

## Proposed Changes

### 1. Tool Model & Definitions
- **[NEW] ui/toolbar/ToolDefinition.kt**:
    - Data class to hold tool metadata: `id`, `label`, `icon`, `commandId`, `enabled`, `visible`, `tooltip`.
- **[MODIFY] ui/toolbar/CategoryPanel.kt**:
    - Update `getToolsForCategory` to return `List<ToolDefinition>`.
    - Populate the `CREATE` category with: Extrude (Enabled), Revolve (Enabled), Sweep (Disabled), Loft (Disabled), Hole (Disabled), Thread (Disabled), Emboss (Disabled), Rib (Disabled).

### 2. UI Presentation Layer
- **[MODIFY] ui/components/CommonUI.kt**:
    - Enhance `LabeledSidebarIconButton` to respect the `enabled` state (using alpha/grayscale for disabled tools).
- **[MODIFY] ui/toolbar/CategoryPanel.kt**:
    - Render the category panel using the new `ToolDefinition` list.
    - Add tooltips/status labels for disabled tools (e.g., "Coming Soon").

### 3. Command Binding
- **[MODIFY] ui/MainCADScreen.kt**:
    - Ensure the `onToolClick` callback correctly maps the `id` from `ToolDefinition` to the appropriate `CadMode` or kernel command.

## Roadmap

1.  **Define Model**: Create the `ToolDefinition` structure.
2.  **Populate Create Category**: Update the tool registry within `CategoryPanel.kt`.
3.  **Visual Update**: Implement the disabled state styling in the UI components.
4.  **Integration**: Connect the new system to the main orkestrator.

## Verification Plan

### Automated Tests
- Build verification to ensure all `ToolDefinition` properties are accessed correctly.

### Manual Verification
- Open the "Create" category from the Tool Rail.
- Verify that **Extrude** and **Revolve** are clickable and active.
- Verify that **Sweep, Loft, Hole, etc.** are visually disabled (grayed out) and non-clickable.
- Verify that touch targets remain at the standard 44dp+ size.
