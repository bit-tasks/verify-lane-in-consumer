import { relative } from "path"

# Verify Changes in Bit Lane in a Consumer Repository

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

**Note:** Use `actions/checkout@v4` and `bit-task/init@v2` with `skip-install: "true"` input parameter, as the prior steps in your pipeline. Define the input parameter following the format `org.scope/lane` in your workflow yml and set its value to `bit-task/lane-branch@v1`task.

```yaml
name: Test Bit Lane Branch
on:
  workflow_dispatch:
    inputs:
      lane_name:
        description: 'The name of the lane to sync from in the format: org.scope/lane'
        required: true
        default: ''
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
          ws-dir: '<WORKSPACE_DIR_PATH>'
          skip-install: 'true'
      - name: Bit Lane Branch
        uses: bit-tasks/lane-branch@v1
        with:
          lane-name: ${{ github.event.inputs.lane_name }}
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
