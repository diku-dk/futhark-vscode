import which from 'which'
import { execSync } from 'child_process'
import semver from 'semver'
import { window, commands, ExtensionContext } from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node'

let client: LanguageClient
const minFutharkVersion = '0.21.9'
const langName = 'futhark'

// entry point of the extension
export async function activate(context: ExtensionContext) {
  which('futhark')
    .then((resolvedPath) => {
      const futharkVersion = execSync('futhark --version', {
        encoding: 'utf-8',
      })
        .split(/\r?\n/)[0]
        .match(/\d+\.\d+\.\d+/)

      // check if futhark's version is compatible
      // lsp included since futhark 0.21.9
      if (futharkVersion && semver.gte(futharkVersion[0], minFutharkVersion)) {
        window.onDidChangeActiveTextEditor((editor) => {
          // fire custom event "custom/onFocusTextDocument"
          // so that the language server can re-compile on focus
          if (editor) {
            const focusedURI = editor.document.uri.toString()

            if (focusedURI.endsWith('.fut')) {
              client.sendNotification('custom/onFocusTextDocument', focusedURI)
            }
          }
        })

        const clientOptions: LanguageClientOptions = {
          documentSelector: [{ scheme: 'file', language: 'futhark' }],
        }

        const serverOptions: ServerOptions = {
          command: resolvedPath,
          // not sure why stdio over ipc (copied from vscode-haskell)
          transport: TransportKind.stdio,
          args: ['lsp'], // run `futhark lsp` to fire up the language server
        }

        client = new LanguageClient(
          langName,
          langName,
          serverOptions,
          clientOptions
        )

        const restartCommand = commands.registerCommand(
          'futhark.commands.restartServer',
          async () => {
            client.info('Restarting server...')
            await client.stop()
            client.info('Starting server...')
            client.start()
          }
        )
        context.subscriptions.push(restartCommand)

        client.start()
      } else {
        window.showErrorMessage(
          `Futhark version is too low, the version you are using is ${futharkVersion},
           but Futhark Language Server is available as part of futhark from version ${minFutharkVersion}
           please follow [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide to upgrade.`
        )
      }
    })
    .catch(() => {
      window.showErrorMessage(
        "Can't find futhark executable, please follow [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide."
      )
    })
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}
