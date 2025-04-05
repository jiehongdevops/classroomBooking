import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScheduleTable from '../components/ScheduleTable';
import { getToken, removeToken } from '../auth';
import { useNavigate } from 'react-router-dom';

function Home() {
  // 預設查詢日期為今天
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const token = getToken();

  // 依據 selectedDate 從後端取得預約資料
  const fetchBookings = () => {
    axios
      .get(`http://localhost:3000/bookings?date=${selectedDate}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      })
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 當 token 或查詢日期變動時，重新取得資料
  useEffect(() => {
    fetchBookings();
  }, [token, selectedDate]);

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <div>
      <h1>教室預約狀態</h1>
      {/* 查詢日期功能 */}
      <div>
        <label>查詢日期: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={fetchBookings}>查詢</button>
      </div>
      <ScheduleTable bookings={bookings} />
      <div style={{ marginTop: '1rem' }}>
        {token ? (
          <>
            <button onClick={() => navigate('/book')}>預約</button>
            <button onClick={() => navigate('/admin')}>管理員介面</button>
            <button onClick={handleLogout}>登出</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>登入</button>
            <button onClick={() => navigate('/register')}>註冊</button>
          </>
        )}
      </div>
      <br />
      <button onClick={fetchBookings}>刷新預約資料</button>
    </div>
  );
}

export default Home;
