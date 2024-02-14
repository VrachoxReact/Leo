const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

let mainWindow;
const db = new sqlite3.Database(
  path.join(app.getPath("userData"), "boxers.db"),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) console.error(err.message);
    db.run(`CREATE TABLE IF NOT EXISTS boxers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    surname TEXT,
    dateOfEnrollment DATE,
    address TEXT,
    phoneNumber TEXT,
    city TEXT,
    identificationNumber TEXT,
    dateOfBirth DATE,
    type TEXT,
    numberOfFights INTEGER,
    lastMedicalExam DATE,
    lastPaymentDate DATE,
    nextPaymentDue DATE
  )`);
  }
);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("add-boxer", (event, boxerData) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      surname,
      dateOfEnrollment,
      address,
      phoneNumber,
      city,
      identificationNumber,
      dateOfBirth,
      type,
      numberOfFights,
      lastMedicalExam,
      lastPaymentDate,
      nextPaymentDue,
    } = boxerData;
    db.run(
      `INSERT INTO boxers (name, surname, dateOfEnrollment, address, phoneNumber, city, identificationNumber, dateOfBirth, type, numberOfFights, lastMedicalExam, lastPaymentDate, nextPaymentDue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        surname,
        dateOfEnrollment,
        address,
        phoneNumber,
        city,
        identificationNumber,
        dateOfBirth,
        type,
        numberOfFights,
        lastMedicalExam,
        lastPaymentDate,
        nextPaymentDue,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
});

ipcMain.handle("get-boxers", () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM boxers", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle("delete-boxer", (event, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM boxers WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
