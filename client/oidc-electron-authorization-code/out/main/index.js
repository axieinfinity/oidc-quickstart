"use strict";
require("isomorphic-fetch");
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config({ path: "../../.env" });
const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT ?? "http://localhost:8080";
const CALLBACK_DEEPLINK = process.env.CALLBACK_DEEPLINK ?? "mavis-sso://oauth2/callback";
const SSO_ENDPOINT = process.env.SSO_ENDPOINT || "https://api-gateway.skymavis.one";
const CLIENT_ID = process.env.CLIENT_ID ?? "";
const gotTheLock = electron.app.requestSingleInstanceLock();
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    electron.app.setAsDefaultProtocolClient("mavis-sso", process.execPath, [
      path.resolve(process.argv[1])
    ]);
  }
} else {
  electron.app.setAsDefaultProtocolClient("mavis-sso");
}
function createWindow() {
  const mainWindow2 = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow2.on("ready-to-show", () => {
    mainWindow2.show();
  });
  mainWindow2.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow2.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow2.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
if (!gotTheLock) {
  electron.app.quit();
} else {
  electron.app.on("second-instance", (_, commandLine) => {
    const url = commandLine?.pop()?.slice(0, -1) ?? "";
    if (url.startsWith(CALLBACK_DEEPLINK)) {
      urlResolve(url);
    }
  });
}
let urlResolve;
const urlPromise = new Promise((resolve) => urlResolve = resolve);
electron.app.on("open-url", (_, url) => {
  if (url.startsWith(CALLBACK_DEEPLINK)) {
    urlResolve(url);
  }
});
electron.ipcMain.handle("request_login", async () => {
  const query = new URLSearchParams({
    state: crypto.randomUUID(),
    client_id: CLIENT_ID,
    response_type: "code",
    scopes: "openid",
    remember: "false",
    redirect_uri: CALLBACK_DEEPLINK
  });
  electron.shell.openExternal(`${SSO_ENDPOINT}/oauth2/auth?${query.toString()}`);
  try {
    const callbackUrl = await urlPromise;
    const code = new URL(callbackUrl).searchParams.get("code");
    if (!code) {
      return null;
    }
    const { data } = await axios({
      baseURL: SERVER_ENDPOINT,
      url: "/oauth2/authorization-code/token",
      method: "POST",
      data: {
        code,
        grant_type: "code",
        scope: "openid offline"
      }
    });
    return {
      token: data
    };
  } catch (error) {
  }
});
