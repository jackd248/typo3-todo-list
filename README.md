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

The project uses [ddev](https://ddev.readthedocs.io/en/stable/) for local development.

Start the ddev container:

```shell
ddev start
```

Launch the application:

```shell
ddev launch
```

> Default credentials for TYPO3 backend:
>
> User: `admin`, password: `Password1!`

## Technologies

The application uses the following basis technologies:

- **Frontend**:
  - [beercss](https://www.beercss.com/)
  - [svelte](https://svelte.dev/)
- **Backend**:
  - TYPO3 v13
  - [t3api Extension](https://extensions.typo3.org/extension/t3api)

## Development

Change the application context to `Development`:

```shell
echo "web_environment:
- TYPO3_CONTEXT=Development" > .ddev/config.local.yaml
```

### Frontend

The frontend build process is based on postcss and esbuild.

Run the following command on development context to start the file watcher building process:

```shell
ddev npm run watch
```

Run the following command on production context to build the frontend:

```shell
ddev npm run build
```

## Code Quality

## Backend

```shell
ddev composer php:lint
ddev composer php:fixer
ddev composer php:stan
ddev composer xml:lint
```

## Frontend

```shell

ddev npm run es:lint
ddev npm run es:format
```

## Tests

The application uses [playwright](https://playwright.dev/) for end-to-end tests.

Therefor several frontend **acceptance** and **api** tests are provided.

Initial setup:

```shell
ddev npm run test:install
```

Run the tests:

```shell
ddev npm run test
```
