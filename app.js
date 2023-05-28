const { app, BrowserWindow, globalShortcut, dialog, Menu } = require("electron");

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { label: "Save" },
            {
                label: "Setting",
                click() {
                    win.loadFile("hell.html");
                }
            },
            { role: 'quit' }
        ]
    },
    { label: 'About', },
    { label: 'Help' }
]

// let secureAesMenu = Menu.buildFromTemplate(menuTemplate);
// Menu.setApplicationMenu(secureAesMenu);

const Createwin = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 650,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    globalShortcut.register("ctrl + o", () => {
        dialog.showOpenDialog();
    })

    win.loadFile("index.html");
};

app.on("ready", Createwin);
