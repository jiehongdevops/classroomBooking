import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../auth';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [bookings, setBookings] = useState([]);
  const token = getToken();
  const navigate = useNavigate();

  // 定義取得預約資料的函式
  const fetchBookings = () => {
    axios.get('http://localhost:3000/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setBookings(res.data);
      })
      .catch(err => {
        console.error("取得預約資料錯誤:", err);
        alert("取得預約資料錯誤");
      });
  };

  // 初次載入時取得預約資料
  useEffect(() => {
    fetchBookings();
  }, [token]);

  // 處理核准/駁回操作
  const handleUpdate = (id, status) => {
    axios.put(`http://localhost:3000/bookings/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        alert('更新成功');
        fetchBookings();  // 更新後重新取得資料
      })
      .catch(err => {
        console.error("更新預約狀態錯誤:", err);
        alert('更新失敗');
      });
  };

  return (
    <div>
      <h1>管理員審核介面</h1>
      <button onClick={() => navigate('/')}>回首頁</button>
      <button onClick={fetchBookings}>刷新預約資料</button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>日期</th>
            <th>時段</th>
            <th>教室</th>
            <th>狀態</th>
            <th>使用者</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.date}</td>
                <td>{b.timeSlot}</td>
                <td>{b.classroom}</td>
                <td>{b.status}</td>
                <td>{b.user}</td>
                <td>
                  {b.status === 'pending' ? (
                    <>
                      <button onClick={() => handleUpdate(b.id, 'approved')}>核准</button>
                      <button onClick={() => handleUpdate(b.id, 'rejected')}>駁回</button>
                    </>
                  ) : (
                    '無操作'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">無預約資料</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
