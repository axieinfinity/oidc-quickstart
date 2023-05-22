require('dotenv').config()
import 'isomorphic-fetch'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { client, extractQueryParams, generateCodeVerifier } from './client'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

let codeResolve: (query: Record<string, string>) => void

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const codePromise = new Promise<Record<string, string>>((resolve) => (codeResolve = resolve))

app.on('open-url', (_event, url) => {
  if (url.startsWith('foo://callback')) {
    const query = extractQueryParams(url)
    if (query.code) {
      codeResolve(query)
    }
  }
})

console.log('process.env.API_KEY', process.env.API_KEY)
console.log('process.env.API_KEY', process.env.CLIENT_SECRET)

ipcMain.handle('request_login', async (_, args) => {
  const codeVerifier = await generateCodeVerifier()
  const uri = await client.authorizationCode.getAuthorizeUri({
    redirectUri: 'foo://callback',
    codeVerifier
  })
  shell.openExternal(uri)
  const query = await codePromise
  const token = await client.authorizationCode.getToken({
    code: query.code,
    codeVerifier: codeVerifier,
    redirectUri: 'foo://callback',
    apiKey: process.env.API_KEY,
    clientSecret: process.env.CLIENT_SECRET
  })
  console.log('token', token)
  return token
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
