import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/register', { username, password })
      .then(res => {
        alert('註冊成功，請用新帳號登入');
        navigate('/login');
      })
      .catch(err => {
        console.error(err);
        alert('註冊失敗，可能帳號已存在');
      });
  };

  return (
    <div>
      <h1>註冊</h1>
      <form onSubmit={handleSubmit}>
        <label>使用者名稱:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <br />
        <label>密碼:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">註冊</button>
      </form>
    </div>
  );
}

export default Register;
