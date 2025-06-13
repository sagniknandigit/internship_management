import React,{useState} from 'react'
import {Link} from 'react-router-dom'

const Register = () => {
  const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
  });

  const [error,setError]=useState('');

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit=(e)=>{
    e.preventDefault();

    if(formData.password!=formData.confirmPassword){
      setError("Passwords do not match");
      return;
    }
    console.log("Registered:",formData);
    setError('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Intern Register</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type='text' name='name' placeholder='Enter Full Name' value={formData.name} onChange={handleChange} style={styles.input} required></input>
        <input type='text' name='email' placeholder='Enter Email' value={formData.email} onChange={handleChange} style={styles.input} required></input>
        <input type='text' name='password' placeholder='Enter password' value={formData.password} onChange={handleChange} style={styles.input} required></input>
        <input type='text' name='confirmPassword' placeholder='Re-enter your password' value={formData.confirmPassword} onChange={handleChange} style={styles.input} required></input>
        <button type='submit' style={styles.button}>Register</button>
        <p>Already have an account?</p>
        <Link to="/login">
        <button style={styles.button}>Back to login</button></Link>
      </form>
      
    </div>
  );
};

const styles={
  container:{
    width:'350px',
    margin:'40px auto',
    padding:'30px',
    border:'1px solid #ccc',
    borderRadius:'10px',
    boxShadow:'2px 2px  12px rgba(0,0,0,0.1)',
    backgroundColor:'#fff',
    textAlign:'center'
  },

  title:{
    marginBottom:'20px',
    fontSize:'24px'
  },

  form:{
    display:'flex',
    flexDirection:'column',
    gap:'12px'
  },

  input:{
    padding:'10px',
    fontSize:'14px',
    borderRadius:'5px',
    border:'1px solid #ccc'
  },

  button:{
    padding:'10px',
    backgroundColor:'#28a745',
    color:'#fff',
    border:'none',
    fontWeight:'bold',
    borderRadius:'5px',
    cursor:'pointer'
  },

  error:{
    color:'red',
    marginBottom:'10px'
  }
};

export default Register
