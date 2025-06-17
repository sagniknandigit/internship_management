import React,{useState} from 'react'
import {Link} from 'react-router-dom'

const InternLogin = () => {
    const [formData,setFormData]=useState({
        email:'',
        password:''
    });

    const containerStyle={
        width:'350px',
        margin:'50px auto',
        padding:'30px',
        border:'1px solid #ccc',
        borderRadius:'10px',
        boxShadow:'2px 2px 15px rgba(0,0,0,0.1)',
        backgroundColor:'#fff',
        fontFamily:'Arial, sans-serif'
    };

    const headingStyle={
        textAlign:'center',
        marginBottom:'20px',
        fontSize:'24px',
        color:'#333'
    };

    const inputGroupStyle={
        marginBottom:'15px',
        display:'flex',
        flexDirection:'column'
    };

    const labelStyle={
        marginBottom:'5px',
        fontWeight:'bold'
    };

    const inputStyle={
        padding:'10px',
        borderRadius:'5px',
        border:'1px solid #ccc'
    };

    const buttonStyle={
        width:'100%',
        padding:'10px',
        backgroundColor:'#007bff',
        color:'#fff',
        border:'none',
        borderRadius:'5px',
        cursor:'pointer',
        marginTop:'10px'
    };

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log('Logging in as intern:',formData);
    };

  return (
    <div style={containerStyle}>
        <h2 style={headingStyle}>Intern Login</h2>
        <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type='email' name='email' value={formData.email} onChange={handleChange} required></input>
            </div>
            
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type='password' name='password' value={formData.password} onChange={handleChange} required></input>
            </div>

            <button type='submit' style={buttonStyle}>Login</button>
            <p style={{marginTop:'10px', textAlign:'center'}}>Don't have an account?</p>
            <Link to="/register">
            <button style={buttonStyle}>Go to Register</button></Link>
        </form>
      
    </div>
  )
}

export default InternLogin


