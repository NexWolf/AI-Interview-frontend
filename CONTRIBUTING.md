# Frontend Contribution Guide

## Branch Strategy

- `main` → Production
- `dev` → Development
- `feature/<feature-name>`
- `bugfix/<bug-name>`
- `hotfix/<issue-name>`

---

## Workflow

1. Pull the latest changes from `dev`.
2. Create a feature branch.
3. Implement your changes.
4. Commit your work.
5. Push your branch.
6. Open a Pull Request targeting `dev`.

---

## Pull Requests

Before opening a Pull Request:

- Project builds successfully.
- No TypeScript errors.
- No ESLint errors.
- Components are tested manually.
- Pull Request title clearly explains the change.

---

## Commit Convention

Examples:

```
feat: add dashboard page
fix: resolve login form validation
refactor: simplify sidebar component
docs: update README
```

---

## Code Standards

- Use TypeScript.
- Use reusable components whenever possible.
- Keep components small and focused.
- Remove unused imports.
- Follow the existing folder structure.
- Avoid duplicated code.

---

## Styling

- Use Tailwind CSS.
- Keep styles consistent.
- Reuse existing UI components before creating new ones.

---

## Environment Variables

Never commit `.env`.

Use `.env.example`.

---

## General Rules

- Do not push directly to `main`.
- Always use Pull Requests.
- Delete merged branches.
