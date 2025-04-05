const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  initializeDB,
  getBookingsByDate,
  getAllBookings,
  addBooking,
  updateBookingStatus,
  getUserByUsername,
  addUser,
  checkBookingExists
} = require('./database');
const { authenticateToken, generateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 註冊 API
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    getUserByUsername(username, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      addUser({ username, password, role: 'user' }, (err, newUser) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }
        return res.json({ message: 'User registered successfully', user: newUser });
      });
    });
  } else {
    res.status(400).json({ error: 'Missing username or password' });
  }
});

// 登入 API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    getUserByUsername(username, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = generateToken({ username: user.username, role: user.role });
      return res.json({ token, user: { username: user.username, role: user.role } });
    });
  } else {
    res.status(400).json({ error: 'Missing credentials' });
  }
});

// 以下所有路由皆需驗證 token
app.use(authenticateToken);

// GET 預約資料，支援依日期查詢（query parameter: date）
app.get('/bookings', (req, res) => {
  const date = req.query.date;
  if (date) {
    getBookingsByDate(date, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    });
  } else {
    getAllBookings((err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    });
  }
});

// 新增預約 (狀態預設為 pending)
app.post('/bookings', (req, res) => {
  const { date, timeSlot, classroom } = req.body;
  if (date && timeSlot && classroom) {
    // 檢查是否已有申請（狀態非 rejected）
    checkBookingExists({ date, timeSlot, classroom }, (err, existingBooking) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (existingBooking) {
        return res.status(400).json({ error: '該時段該教室已有申請' });
      }
      // 沒有重複申請，繼續新增預約
      addBooking({ date, timeSlot, classroom, status: 'pending', user: req.user.username }, (err, bookingId) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to add booking' });
        }
        res.json({ message: 'Booking submitted, pending approval', bookingId });
      });
    });
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});


// 更新預約狀態 (僅限管理員)
app.put('/bookings/:id', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No permission' });
  }
  const bookingId = req.params.id;
  const { status } = req.body;
  if (status) {
    updateBookingStatus(bookingId, status, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update booking status' });
      }
      res.json({ message: 'Booking status updated' });
    });
  } else {
    res.status(400).json({ error: 'Missing status parameter' });
  }
});

app.listen(PORT, () => {
  initializeDB();
  console.log(`Server running on port ${PORT}`);
});
