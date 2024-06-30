import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    otp: '',
    showOtpInput: false,
    password: '',
    showPasswordInput: false,
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

  const sendOTP = (e) => {
    e.preventDefault();

    const { email } = user;
    if (email) {
      axios
        .post('http://localhost:9002/sendOTP', { email })
        .then((res) => {
          alert('OTP sent successfully.');
          setUser({
            ...user,
            showOtpInput: true,
          });
        })
        .catch((error) => {
          console.error('Error sending OTP:', error);
          alert('Error sending OTP. Please try again later.');
        });
    } else {
      alert('Please enter your email.');
    }
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    const { email, otp } = user;
    if (otp) {
      axios
        .post('http://localhost:9002/verifyOTP', { email, otp })
        .then((res) => {
          if (res.data === 'OTP verified successfully') {
            alert('OTP verified successfully.');
            setUser({
              ...user,
              showOtpInput: false,
              showPasswordInput: true,
            });
          } else {
            alert('Invalid OTP. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error verifying OTP:', error);
          alert('Error verifying OTP. Please try again later.');
        });
    } else {
      alert('Please enter the OTP.');
    }
  };

  const register = (e) => {
    e.preventDefault();
    try {
      const { email, password, role, state } = user;
      if (email && password && role && state) {
        axios
          .post('http://localhost:9002/register', user)
          .then((res) => {
            alert(res.data.message);
            setUser({
              email: '',
              otp: '',
              showOtpInput: false,
              password: '',
              showPasswordInput: false,
              role: 'resident',
              state: ''
            });
            navigate('/login');
          })
          .catch((error) => {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again later.');
          });
      } else {
        alert('Invalid details');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">SCMS</h1>
          <h2 className="text-xl mb-4">Smart City Management System</h2>
        </div>
        <form onSubmit={register}>
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
            <button
              onClick={sendOTP}
              className="text-white font-bold rounded bg-green-500 p-3 w-full"
              type="button"
            >
              Send OTP
            </button>
          </div>

          {user.showOtpInput && (
            <div className="mb-4">
              <input
                className="p-3 w-full border rounded mb-4"
                type="text"
                name="otp"
                value={user.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                required
              />
              <button
                className="text-white font-bold rounded bg-green-500 p-3 w-full"
                onClick={verifyOTP}
                type="button"
              >
                Verify OTP
              </button>
            </div>
          )}

          {user.showPasswordInput && (
            <>
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
                Sign Up
              </button>
            </>
          )}
        </form>
        <h4 className="text-center mt-4">
          Already have an account?{' '}
          <a className="text-green-500" href="/login">
            Sign In
          </a>
        </h4>
      </div>
    </div>
  );
};

export default SignUp;
