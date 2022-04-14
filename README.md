# Futhark for Visual Studio Code

**The language extension is still in the early stage of development**

This extension adds language support for [Futhark](https://futhark-lang.org/), powered by the [Futhark Language Server](https://github.com/diku-dk/futhark/tree/master/src/Futhark/LSP).

## Features

- Warnings and errors diagnostics from futhark compiler
- Information on hover
- Syntax highlighting
- Go to definition
- Basic language features, e.g. comment toggling, etc
- More to come...

## Common questions

Here are some questions that users may encounter while using the extension, if your issue is not addressed here, please [open an issue](https://github.com/diku-dk/futhark-vscode/issues/new).

### Can't find futhark executable ...

Futhark language extension requires futhark executable to be installed in $PATH, follow the instructions on [how to install the Futhark compiler](https://futhark.readthedocs.io/en/stable/installation.html).

### Futhark version is too low ...

The Futhark Language Server is available as part of futhark from version `0.21.9` and later, please update futhark following [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide. You can run `futhark --version` to check your futhark's version.

## Development

Here are some resources to help you get started with developing the futhark extension:

### Debugging

You will need [nodejs](https://nodejs.org/en/) and [vscode](https://code.visualstudio.com/) installed.

1. `git clone https://github.com/diku-dk/futhark-vscode.git`
2. `cd futhark-vscode && npm install`
3. Open the futhark-vscode repository with VS Code
4. Find the **Run and Debug** from the **Activity Bar** on the left, select the **Launch Extension** launch configuration, and press the **Start Debugging** button to launch an additional Extension Development Host instance of VS Code that executes the extension code. (More information on how to debug with vscode can be found [here](https://code.visualstudio.com/docs/editor/debugging).)
5. Create a `test.fut` file in the root folder write some code!

### Structure

The futhark-vscode repository consists of many files and folders, here are some of the most interesting ones:

- `.vscode/`: development settings for vscode, such as debugging configuration and recommended extensions
- `assets/`: contains the asset files for the [marketplace](https://marketplace.visualstudio.com/items?itemName=DIKU.futhark-vscode), such as the logo
- `src/`: the source code for the extension
- `.vscodeignore`: used to exclude files from being included in your extension's package (more [here](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#using-.vscodeignore))
- `language-configuration.json`: the [language configuration](https://code.visualstudio.com/api/language-extensions/language-configuration-guide) file for the extension
- `futhark.tmLanguage.json`: the [TextMate grammars configuration](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) for the futhark language
- `package.json`: the [extension manifest](https://code.visualstudio.com/api/references/extension-manifest)

### Release

Github Actions [publish-vscode-extension](https://github.com/HaaLeo/publish-vscode-extension) and [action-gh-release](https://github.com/softprops/action-gh-release) are enabled for easy deployment of the extension. To publish a new release, simply follow the steps below:

1. Change the version in the `package.json` to the new one (e.g. `x.y.z`) 
2. Tag the new version by running `git tag vx.y.z` (Note: **tag must start with v**)
3. Push your changes and tags to the remote repository
   ```shell
    git add package.json
    git commit -m "x.y.z"
    git push && git push --tags
   ```

TBA: More information about how to publish, e.g. creation of Personal Access Token, etc. ([source](https://code.visualstudio.com/api/working-with-extensions/publishing-extension))
