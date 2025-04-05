import React, { useState } from 'react';
import axios from 'axios';
import { setToken } from '../auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/login', { username, password })
      .then(res => {
        setToken(res.data.token);
        navigate('/');
      }).catch(err => {
        console.error(err);
        alert('登入失敗');
      });
  };

  return (
    <div>
      <h1>登入</h1>
      <form onSubmit={handleSubmit}>
        <label>使用者名稱:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <br />
        <label>密碼:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">登入</button>
      </form>
    </div>
  );
}

export default Login;

