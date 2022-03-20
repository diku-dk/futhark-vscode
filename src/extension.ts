import * as which from 'which'
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
    .then((resulvedPath) => {
      // temporarily put executable in the same folder as the extension
      // const serverExecutable = context.asAbsolutePath('futhark')
      // run `futhark lsp` to fire up the language server
      const args = ['lsp']

      const serverOptions: ServerOptions = {
        command: resulvedPath,
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
      console.log("Can't find futhark executable")
      console.error(err)
    })
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}
