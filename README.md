# Futhark for Visual Studio Code

**The language extension is still in the early stage of development**

This extension adds language support for [Futhark](https://futhark-lang.org/), powered by the [Futhark Language Server](https://github.com/haoranpb/futhark-language-server).

## Common questions

Here are some questions that users may encounter the extension, if your issue is not addressed here, please [open an issue](https://github.com/diku-dk/futhark-vscode/issues/new).

### Can't find futhark executable ...

Futhark language extension requires futhark executable to be installed in $PATH, follow the instructions on [how to install the Futhark compiler](https://futhark.readthedocs.io/en/stable/installation.html).

### Junk argument: lsp

The Futhark Language Server hasn't been merged yet (it's coming soon), so the `futhark lsp` command is not recognized, you will need to manually install a different version of futhark:

1. Clone futhark from [lsp2022](https://github.com/diku-dk/futhark/tree/lsp2022) branch
2. Compile from source following the [instruction](https://futhark.readthedocs.io/en/stable/installation.html#compiling-from-source)
3. Install the compiled binary in $PATH
