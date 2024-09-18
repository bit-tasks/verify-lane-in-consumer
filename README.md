# Verify a Bit Lane in a Consumer Project

This task verifies the changes on a Bit lane are compatible with the consumer project, maintained in a git repository.
Using this task lanes can be tested in projects that only consume Bit components but do not maintain them.

A Bit lane containes a set of components that are updated together.
This task installs the pre-release version of the components in the lane and runs the tests in the consumer project to verify the changes.

The auto-generated branch is only for testing purposes and should not be merged to the main branch.

### `lane-id`

**Required** The Bit lane ID to install the pre-release version of the components.

### `project-dir`

The relative path to the project directory. Default is `.`.

### `package-manager`

The package manager to install the components. Default is `npm`.

### `use-overrides`

Add the dependencies from the lane to the `"overrides"` section in the `package.json` file. Default is `fasle`.

This option is useful when testing indirect dependencies.

For example, if a lane includes the `button` component, but the consumer project only uses one of the button dependents, the `button-group` component, then installing the lanes' version of the `button` component will not affect the project (since it's not used directly).
To solve that isSecureContext, either include the relevant dependents in the lane (in this case, the `button-group` component) or use the `use-overrides` option to force the use of the lane's version of the `button` component.

### `test-command`

The command to run the tests after the dependencies from the lane were installed. Default is `npm test`.
This is especially usefull when you use the `skip-push` input to run the installation without committing the changes back (in this case your CI will not be triggered and you would need to explicitly define a testing script).

### `skip-push`

Run the tests without committing back the changes to a new branch (for fully automated testing that doesn't require further actions). Default is `false`.

## Example usage

```yml
name: Verify Lane In Consumer
on:
  workflow_dispatch:
    inputs:
      lane-id:
        description: 'The ID of the lane to install from in the format: org.scope/lane'
        required: true
permissions:
  contents: write
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GIT_USER_NAME: ${{ secrets.GIT_USER_NAME }}
      GIT_USER_EMAIL: ${{ secrets.GIT_USER_EMAIL }}
      BIT_CONFIG_ACCESS_TOKEN: ${{ secrets.BIT_CONFIG_ACCESS_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Initialize Bit
        uses: bit-tasks/init@v2
        with:
          skip-install: 'true'
      - name: Verify Lane In Consumer
        uses: bit-tasks/verify-lane-in-consumer@v1
        with:
          lane-id: ${{ github.event.inputs.lane-id }}
```

# Contributor Guide

Steps to create custom tasks in different CI/CD platforms.

## GitHub Actions

Go to the GithHub action task directory and build using NCC compiler. For example;

```
npm install
npm run build
git commit -m "Update task"
git tag -a -m "action release" v1 --force
git push --follow-tags
```

For more information, refer to [Create a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
