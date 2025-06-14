import React, { useState } from 'react';

const InternRegister = () => {
  const [intern, setIntern] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
  });

  const handleChange = (e) => {
    setIntern({ ...intern, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Intern registered');
    console.log('Intern:', intern);
  };

  return (
    <div style={cardStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        {['name', 'email', 'college', 'course'].map((field, i) => (
          <input
            key={i}
            name={field}
            value={intern[field]}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        ))}
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={intern.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={intern.confirmPassword}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={submitBtn}>
          Register as Intern
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
  backgroundColor: '#28a745',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default InternRegister;
