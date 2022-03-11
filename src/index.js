const { app, BrowserWindow, Tray, Menu } = require("electron");

let window;

async function createWindow() {
	window = new BrowserWindow({
		title: "Chromium DevTools",
		icon: "./icon.png",
		webPreferences: {
			nodeIntegration: true,
			experimentalFeatures: true,
			contextIsolation: false,
		},
		autoHideMenuBar: true,
		backgroundColor: "#202124",
		show: false,
	});

	window.on("close", function (event) {
		event.preventDefault();
		window.hide();
		return false;
	});
	window.once("ready-to-show", () => {
		window.show();
	});

	window.openDevTools();
	window.setIcon("./src/icon.png");
	window.loadFile("./index.html");

	const tray = new Tray("./src/icon.png");
	tray.setToolTip("Chromium DevTools");

	tray.on("double-click", () => {
		if (window.isVisible()) {
			window.hide();
		} else {
			window.show();
		}
	});
	tray.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: "Show DevTools",
				type: "normal",
				click: () => {
					window.show();
				},
			},
			{
				label: "Open New DevTools",
				type: "normal",
				click: () => {
					// Run another instance of this program.
					const { spawn } = require("child_process");
					const [_, ...args] = process.argv;
					spawn(process.execPath, args, {
						detached: true,
						stdio: "ignore",
					});
				},
			},
			{
				label: "Quit",
				type: "normal",
				click: () => {
					app.quit();
					tray.destroy();
					process.exit();
				},
			},
		])
	);
}

app.on("ready", createWindow);
