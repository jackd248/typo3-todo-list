<div align="center">

![Extension icon](Resources/Public/Icons/Extension.svg)

# TYPO3 extension `typo3_todo_list`

[![Supported TYPO3 versions](https://badgen.net/badge/TYPO3/13/orange)]()

</div>

This extension provides a simple todo list application for TYPO3.

![Preview](./Documentation/Preview.png)

## Task

#### 1. **Core Features**
- [x] Display tasks (if tasks are present)
- [x] Show a form to add new tasks if no tasks are available
- [x] Allow the creation of new tasks at any time
- [x] Task structure:
    - **Title** (required)
    - Description (optional)
    - Due date (optional)
- [x] Highlight tasks that are nearing or past their due date
- [x] Enable editing, completing, and deleting tasks

#### 2. **User Experience**
- [x] Ensure intuitive and easy-to-use interface
- [x] Consistent and appealing UI design
- [x] Recognizable and cross-platform interface design

#### 3. **Technical Considerations**
- [ ] Use modern technical approaches for cross-platform reusability
- [ ] Implement frameworks or custom designs for UI and UX
- [ ] Use tests to ensure code quality

#### 4. **PWA (Optional)**
- [ ] Support offline functionality (viewing, editing, and deleting tasks)
- [ ] Option to save the application as a Progressive Web App (PWA)

#### 5. **Additional Notes**
- [ ] Focus on a user-friendly and maintainable codebase

## Install

```shell
ddev start
```

## Technologies

- **Frontend**:
  - beercss
  - svelte
- **Backend**:
  - TYPO3: v13
  - Extension:
    - t3api

## Code Quality

```shell
ddev composer php:lint
ddev composer php:fixer
ddev composer php:stan
ddev composer xml:lint
```

## Tests

- playwright
  - frontend
  - api

```shell
ddev npm run test:install
```

```shell
ddev npm run test
```
