import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const Navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: '',
    role: 'resident',
    state: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
          const { email, password, role, state } = user;
      const response = await axios.post('http://localhost:9002/login', user);
      const { userId, token } = response.data; // Assuming your API response includes userId and token
      localStorage.setItem('token', token); // Store the token in localStorage
      localStorage.setItem('userId', userId);
      alert('Login successful!');
      Navigate(`/home?state=${state}`)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid credentials.'); // Display alert for wrong password
      } else {
        alert('Error logging in. Please try again later.'); // Display alert for other errors
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">SCMS</h1>
          <h2 className="text-xl mb-4">Smart City Management System</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              className="p-3 w-full border rounded mb-4"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="p-3 w-full border rounded mb-4"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4">
            <select
              className="p-3 w-full border rounded mb-4"
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            >
              <option value="resident">Resident</option>
              <option value="cityOfficial">City Official</option>
            </select>
          </div>
          <div className="mb-4">
            <input
              className="p-3 w-full border rounded mb-4"
              type="text"
              name="state"
              value={user.state}
              onChange={handleChange}
              placeholder="Enter your state"
              required
            />
          </div>
          <button
            className="text-white font-bold rounded bg-green-500 p-3 w-full"
            type="submit"
          >
            Login
          </button>
        </form>
        <h4 className="text-center mt-4">
          Don't have an account?{' '}
          <a className="text-green-500" href="/signup">
            Sign Up
          </a>
        </h4>
      </div>
    </div>
  );
};

export default Login;
