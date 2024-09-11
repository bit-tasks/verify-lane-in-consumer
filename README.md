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
