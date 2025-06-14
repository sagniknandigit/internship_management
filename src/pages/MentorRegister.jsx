import React, { useState } from 'react';

const MentorRegister = () => {
  const [mentor, setMentor] = useState({
    employeeID: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setMentor({ ...mentor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mentor Registered');
    console.log('Mentor:', mentor);
  };

  return (
    <div style={cardStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="employeeID"
          placeholder="Enter Employee ID"
          value={mentor.employeeID}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={mentor.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={mentor.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={mentor.confirmPassword}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={submitBtn}>
          Register as Mentor
        </button>
      </form>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '350px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const submitBtn = {
  padding: '12px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default MentorRegister;
