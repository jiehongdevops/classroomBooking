import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../auth';
import { useNavigate } from 'react-router-dom';

function Book() {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [classroom, setClassroom] = useState('');
  const navigate = useNavigate();
  const token = getToken();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/bookings', { date, timeSlot, classroom }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      alert('預約已送出，待審核');
      navigate('/');
    }).catch(err => {
      console.error(err);
      alert('預約失敗');
    });
  };

  return (
    <div>
      <h1>Classroom booking</h1>
      <form onSubmit={handleSubmit}>
        <label>Date:
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <br />
        <label>Time:
          <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
            <option value="">Choose Time</option>
            <option value="時段1">09:00~12:00</option>
            <option value="時段2">13:00~16:00</option>
            <option value="時段3">19:00~21:00</option>
            <option value="時段4">21:00~23:00</option>
          </select>
        </label>
        <br />
        <label>Classroom:
          <select value={classroom} onChange={e => setClassroom(e.target.value)}>
            <option value="">Choose Class</option>
            <option value="B01">B01</option>
            <option value="B02">B02</option>
            <option value="B03">B03</option>
            <option value="B04">B04</option>
            <option value="B05">B05</option>
            <option value="B06">B06</option>
            <option value="B07">B07</option>
            <option value="B08">B08</option>
            <option value="B09">B09</option>
            <option value="101">101</option>
            <option value="102">102</option>
            <option value="conf">會議室</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Book;
