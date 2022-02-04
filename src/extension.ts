import { ExtensionContext } from 'vscode'

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node'

let client: LanguageClient

// entry point of the extension
export async function activate(context: ExtensionContext) {
  // temporarily put executable in the same folder as the extension
  const serverExecutable = context.asAbsolutePath('futhark')
  // run `futhark lsp program` to fire up the language server
  const args = ['lsp', 'program']

  const serverOptions: ServerOptions = {
    command: serverExecutable,
    // not sure why stdio over ipc (copied from vscode-haskell)
    transport: TransportKind.stdio,
    args,
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'futhark' }],
  }

  const langName = 'futhark'
  client = new LanguageClient(langName, langName, serverOptions, clientOptions)

  client.start()
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}
