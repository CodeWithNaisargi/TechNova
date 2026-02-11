# .agent Folder

This folder contains configuration and context files for Amazon Q Developer agent to better understand and assist with the SkillOrbit LMS project.

## Files

### agent-config.json
Project metadata and capabilities configuration for the AI agent.

### context.md
High-level project context, architecture decisions, and important patterns to follow.

### tasks.md
Current development tasks, priorities, and known issues tracking.

### prompts.md
Common development scenarios and prompt templates for efficient agent interaction.

### dependencies.md
Complete list of project dependencies with versions and update strategies.

## Purpose
These files help Amazon Q Developer:
- Understand project structure and conventions
- Generate code following established patterns
- Provide context-aware suggestions
- Track development priorities
- Maintain consistency across the codebase

## Usage
The agent automatically reads these files when providing assistance. You can reference specific files in your prompts:
- "Follow the patterns in context.md"
- "Check tasks.md for current priorities"
- "Use the prompts in prompts.md"

## Maintenance
Update these files as the project evolves:
- Add new features to agent-config.json
- Document architectural changes in context.md
- Track new tasks and issues in tasks.md
- Add common scenarios to prompts.md
- Update dependency versions in dependencies.md
