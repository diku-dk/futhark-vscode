import { execSync } from 'child_process'
import semver from 'semver'
import { window, workspace, commands, ExtensionContext, env, Uri } from 'vscode'
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
  const futharkServerOptions = validateFutharkPath(
    futharkConfig.get('futharkExecutablePath'),
    futharkConfig.get('useWSL')
  )

  if (futharkServerOptions) {
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

    client = new LanguageClient(langName, langName, futharkServerOptions, clientOptions)

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

function validateFutharkPath(
  userDefinedPath: string | undefined,
  useWSL: boolean | undefined
): ServerOptions | null {
  let executablePath = resolveHOMEPlaceHolders(userDefinedPath ? userDefinedPath : langName)

  // Retrieve output of Futhark's version command
  let futharkOutput;
  try {
    // WSL
    if (process.platform == 'win32' && useWSL) {
      futharkOutput = execSync(`wsl ${executablePath} --version`, {
        encoding: 'utf-8',
      })
    } 
    // Non-WSL
    else {
      futharkOutput = execSync(`${executablePath} --version`, {
        encoding: 'utf-8',
      })
    }
  } catch (err) {
    // Error in user's defined executable path
    if (userDefinedPath) {
      window.showErrorMessage(
          `Futhark: Please validate executable path and reload the window.`,
          'Open Settings'
        )
        .then((selection) => {
          commands.executeCommand('workbench.action.openSettings', '@ext:DIKU.futhark-vscode')
        })
    }
    // Cannot find Futhark in system path
    else {
      window.showErrorMessage(
          `Futhark: Please install Futhark using the [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide. If using WSL, you may need to manually specify Futhark's path.`,
          'Open Settings',
          'Open Installation Guide'
        )
        .then((selection) => {
          if (selection == 'Open Settings') {
            commands.executeCommand('workbench.action.openSettings', '@ext:DIKU.futhark-vscode')
          } else {
            env.openExternal(Uri.parse('https://futhark.readthedocs.io/en/stable/installation.html'))
          }
        })
    }
    console.error(err)
    return null;
  }

  // Determine the version of this Futhark executable
  const futharkVersion = futharkOutput.match(/Futhark\s(\d+\.\d+\.\d+)/)

  // Success: We find a version number and it supports LSP. Return the ServerOptions for this executable path.
  if (futharkVersion && semver.gte(futharkVersion[1], minFutharkVersion)) {
    // WSL
    if (process.platform == 'win32' && useWSL) {
      return {
        command: 'wsl',
        args: [executablePath, 'lsp'],
        transport: TransportKind.stdio,
      }
    }
    // Non-WSL
    else {
      return {
        command: executablePath,
        args: ['lsp'], // run `futhark lsp` to fire up the language server
        // not sure why stdio over ipc (copied from vscode-haskell)
        transport: TransportKind.stdio,
      }
    }
  }
  // Fail: We find a version number, but it doesn't support LSP
  else if (futharkVersion && futharkVersion[1]) {
    window.showErrorMessage(
        `Futhark: Outdated version of Futhark (${futharkVersion[1]}). Futhark Language Server is only available after version ${minFutharkVersion}. Please follow the [Installation](https://futhark.readthedocs.io/en/stable/installation.html) guide to upgrade.`,
        'Open Installation Guide'
      )
      .then((selection) => {
        env.openExternal(Uri.parse('https://futhark.readthedocs.io/en/stable/installation.html'))
      })
    console.error(futharkOutput)
  }
  // Fail: We cannot find a version number. It's a valid executable, but likely not Futhark.
  else {
    window.showErrorMessage(
        `Futhark: Error identifying version. Please confirm that this is a valid Futhark executable.`,
        'Open Settings'
      )
      .then((selection) => {
        commands.executeCommand('workbench.action.openSettings', '@ext:DIKU.futhark-vscode')
      })
    console.error(futharkOutput)
  }
  return null
}