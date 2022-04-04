# Futhark for Visual Studio Code

**The language extension is still in the early stage of development**

This extension adds language support for [Futhark](https://futhark-lang.org/), powered by the [Futhark Language Server](https://github.com/diku-dk/futhark/tree/master/src/Futhark/LSP).

## Features

- Warnings and errors diagnostics from futhark compiler
- Information on hover
- More to come...

## Common questions

Here are some questions that users may encounter while using the extension, if your issue is not addressed here, please [open an issue](https://github.com/diku-dk/futhark-vscode/issues/new).

### Can't find futhark executable ...

Futhark language extension requires futhark executable to be installed in $PATH, follow the instructions on [how to install the Futhark compiler](https://futhark.readthedocs.io/en/stable/installation.html).

### Junk argument: lsp

The Futhark Language Server will be available in the next release of futhark, so the `futhark lsp` command may not be recognized in your current version, you will need to install futhark via [compiling from source](https://futhark.readthedocs.io/en/stable/installation.html#compiling-from-source).
