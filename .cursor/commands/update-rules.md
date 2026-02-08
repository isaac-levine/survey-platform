# Update Rules Command

Use this command to update `.cursorrules` with new patterns, best practices, or corrections learned during development.

## Usage

When you want to update the rules file, simply say:
- `/rule` or `/update-rules` or "update rules"

The AI will automatically:
1. Review the current conversation context
2. Identify new patterns, mistakes, or learnings
3. Update `.cursorrules` with relevant information
4. Organize rules into appropriate sections

## What Gets Updated

- **Code Quality**: Linting patterns, type safety, formatting
- **Prisma**: Migration workflows, schema change patterns
- **Git/PR**: Workflow improvements, pre-commit checks
- **Project-Specific**: Framework patterns, tool configurations
- **Common Mistakes**: Errors to avoid, corrections learned

## Examples

After fixing linting errors:
- "Update rules with the linting requirements we just fixed"
- The AI will add the linting patterns to the Code Quality section

After learning a new migration pattern:
- "Add this migration pattern to rules"
- The AI will update the Prisma section

After a deployment issue:
- "Update rules with the deployment steps we learned"
- The AI will add deployment notes to the appropriate section
