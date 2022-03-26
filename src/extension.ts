import which from 'which'
import vscode from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node'

let client: LanguageClient

// entry point of the extension
export async function activate() {
  which('futhark')
    .then((resolvedPath) => {
      // run `futhark lsp` to fire up the language server
      const args = ['lsp']

      const serverOptions: ServerOptions = {
        command: resolvedPath,
        // not sure why stdio over ipc (copied from vscode-haskell)
        transport: TransportKind.stdio,
        args,
      }

      const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'futhark' }],
      }

      const langName = 'futhark'
      client = new LanguageClient(
        langName,
        langName,
        serverOptions,
        clientOptions
      )

      client.start()
    })
    .catch((err) => {
      vscode.window.showErrorMessage("Can't find futhark executable, please follow [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide.")
      console.error(err)
    })
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}
