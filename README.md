# Futhark for Visual Studio Code

**The language extension is still in the early stage of development, and is not yet published on the extension marketplace.**

This extension adds language support for [Futhark](https://futhark-lang.org/), powered by the [Futhark Language Server](https://github.com/haoranpb/futhark-language-server).

## Usage

1. Download the latest version of `futhark-x.x.x.vsix` from the [Releases](https://github.com/haoranpb/vscode-futhark/releases)
2. [Install the extension](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix) from the `VSIX` file
3. Open a `.fut` file in Visual Studio Code

## Development

1. Build [futhark language server](https://github.com/haoranpb/futhark-language-server)
  1. Put newly generated `futhark-language-server` executable in this directory
2. Install dependencies `npm install`
3. Open VS Code on this folder
4. Switch to the `Run and Debug` view in the Sidebar
5. Run the `Launch Extension` config
6. In the newly opened VSCode instance, open a document with `.fut` extension
