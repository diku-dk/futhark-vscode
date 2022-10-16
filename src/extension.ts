import which from 'which'
import { execSync } from 'child_process'
import semver from 'semver'
import { window, workspace, commands, ExtensionContext } from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node'
import { resolveHOMEPlaceHolders } from './utils'

let client: LanguageClient
const minFutharkVersion = '0.21.9'
const langName = 'futhark'

// entry point of the extension
export async function activate(context: ExtensionContext) {
  const futharkConfig = workspace.getConfiguration(langName)
  const futharkExecutable = findFutharkExecutable(futharkConfig.get('futharkExecutablePath'))

  if (futharkExecutable) {
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
      documentSelector: [{ scheme: 'file', language: langName }],
    }

    const serverOptions: ServerOptions = {
      command: futharkExecutable,
      // not sure why stdio over ipc (copied from vscode-haskell)
      transport: TransportKind.stdio,
      args: ['lsp'], // run `futhark lsp` to fire up the language server
    }

    client = new LanguageClient(langName, langName, serverOptions, clientOptions)

    const restartCommand = commands.registerCommand('futhark.commands.restartServer', async () => {
      client.info('Restarting server...')
      await client.stop()
      client.info('Starting server...')
      client.start()
    })
    context.subscriptions.push(restartCommand)

    client.start()
  }
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}

function findFutharkExecutable(userDefinedPath: string | undefined): string | null {
  const potentialExecutablePath = userDefinedPath ? userDefinedPath : langName
  const executablePath = which.sync(resolveHOMEPlaceHolders(potentialExecutablePath), {
    nothrow: true,
  })

  if (executablePath && executablePath.endsWith(langName)) {
    const futharkVersion = execSync(`${executablePath} --version`, {
      encoding: 'utf-8',
    })
      .split(/\r?\n/)[0]
      .match(/\d+\.\d+\.\d+/)

    if (futharkVersion && semver.gte(futharkVersion[0], minFutharkVersion)) {
      return executablePath
    } else {
      window.showErrorMessage(
        `Futhark version is too low, the version you are using is ${futharkVersion},
         but Futhark Language Server is available as part of futhark from version ${minFutharkVersion}
         please follow [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide to upgrade.`
      )
      return null
    }
  } else {
    if (userDefinedPath) {
      window.showErrorMessage(
        `The path defined ("${userDefinedPath}") is not a valid futhark executable.`
      )
    }
    window.showErrorMessage(
      "Can't find futhark executable, please follow [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide."
    )
    return null
  }
}
