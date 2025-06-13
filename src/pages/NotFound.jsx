import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link to="/login"><button style={buttonStyle}>Go to Login</button></Link>
    </div>
  );
};

const buttonStyle={
    backgroundColor:'#dc3545',
    color:'white',
    border:'none',
    borderRadius:'5px',
    cursor:'pointer'
};
export default NotFound
