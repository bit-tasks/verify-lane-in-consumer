# Verify a Bit Lane in a Consumer Project

This task verifies the changes on a Bit lane are compatible with the consumer project.

A Bit lane containes a set of components that are updated together.
This task installs the pre-release version of the components in the lane and runs the tests (or deploys to stage) in the consumer project to verify the changes.

The auto-generated branch is only for testing purposes and should not be merged to the main branch.

### `lane-id`

**Required** The Bit lane ID to install the pre-release version of the components.

### `project-dir`

The relative path to the project directory. Default is `.`.

### `package-manager`

The package manager to install the components. Default is `npm`.

### `test-command`

The command to run the tests. Default is `npm test`.

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
        uses: bit-tasks/verify-lane-in-consumer@main
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
