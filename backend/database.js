const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

function initializeDB() {
  db.serialize(() => {
    // 建立 bookings 資料表
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      timeSlot TEXT,
      classroom TEXT,
      status TEXT,
      user TEXT
    )`);

    // 建立 users 資料表
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )`, (err) => {
      if (err) {
        console.error('建立 users 資料表錯誤:', err);
      } else {
        // 若尚未建立預設 admin 使用者則插入
        db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
          if (err) {
            console.error(err);
          } else if (!row) {
            db.run(
              `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
              ['admin', 'admin', 'admin'],
              function (err) {
                if (err) {
                  console.error('建立 admin 使用者錯誤:', err);
                } else {
                  console.log('預設 admin 使用者已建立。');
                }
              }
            );
          }
        });
      }
    });
  });
}

function getBookingsByDate(date, callback) {
  db.all("SELECT * FROM bookings WHERE date = ?", [date], (err, rows) => {
    callback(err, rows);
  });
}

function getAllBookings(callback) {
  db.all("SELECT * FROM bookings", (err, rows) => {
    callback(err, rows);
  });
}

function addBooking(booking, callback) {
  const { date, timeSlot, classroom, status, user } = booking;
  db.run(
    "INSERT INTO bookings (date, timeSlot, classroom, status, user) VALUES (?, ?, ?, ?, ?)",
    [date, timeSlot, classroom, status, user],
    function (err) {
      callback(err, this ? this.lastID : null);
    }
  );
}

function updateBookingStatus(id, status, callback) {
  db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id], function (err) {
    callback(err);
  });
}

function getUserByUsername(username, callback) {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    callback(err, row);
  });
}

function addUser(user, callback) {
  const { username, password, role } = user;
  db.run(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role],
    function (err) {
      callback(err, { id: this.lastID, username, role });
    }
  );
}

function checkBookingExists(booking, callback) {
  const { date, timeSlot, classroom } = booking;
  db.get(
    "SELECT * FROM bookings WHERE date = ? AND timeSlot = ? AND classroom = ? AND status != 'rejected'",
    [date, timeSlot, classroom],
    (err, row) => {
      callback(err, row);
    }
  );
}

module.exports = {
  initializeDB,
  getBookingsByDate,
  getAllBookings,
  addBooking,
  updateBookingStatus,
  getUserByUsername,
  addUser,
  checkBookingExists
};
