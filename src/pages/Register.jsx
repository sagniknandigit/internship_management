import React,{useState} from 'react'
import InternRegister from './InternRegister';
import MentorRegister from './MentorRegister';
import {Link} from 'react-router-dom'

const Register = () => {
  const [role,setRole]=useState('intern');

  return (
    <div style={{textAlign:'center',padding:'30px'}}>
      <h2>Register as {role==='intern'?'Intern':'Mentor'}</h2>
      <div style={{marginBottom:'20px'}}>
        <button onClick={()=> setRole('intern')} style={role==='intern'? activeBtn:inactiveBtn}>Intern</button>
        <button onClick={()=> setRole('mentor')} style={role==='mentor'? activeBtn:inactiveBtn}>Mentor</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {role === 'intern' ? <InternRegister /> : <MentorRegister />}
      </div>
    </div>
  );
};

const activeBtn={
  padding:'10px 20px',
  margin:'0 10px',
  backgroundColor:'#007bff',
  color:'white',
  border:'none',
  borderradius:'5px',
  cursor:'pointer',
};

const inactiveBtn={
  padding:'10px 20px',
  margin:'0 10px',
  backgroundColor:'#e0e0e0',
  color:'#333',
  border:'none',
  borderradius:'5px',
  cursor:'pointer',
}

export default Register
