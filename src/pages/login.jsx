import React,{useState} from 'react'
import InternLogin from './InternLogin'
import MentorLogin from './MentorLogin'

const Login = () => {
    const [role,setRole]=useState('intern');

    const togglebuttonStyle={
        padding:'10px 20px',
        margin:'0 10px',
        backgroundColor:'#007bff',
        color:'#fff',
        border:'none',
        borderRadius:'5px',
        cursor:'pointer'
    };

    const containerStyle={
        textAlign:'center',
        marginTop:'30px',
    };

    
  return (
    <div style={containerStyle}>
        <h2>Login as {role==='intern'? 'Intern':'Mentor'}</h2>
        <div style={{marginBottom:'20px'}}>
            <button onClick={()=> setRole('intern')} style={togglebuttonStyle}>Intern</button>
            <button onClick={()=> setRole('mentor')} style={togglebuttonStyle}>Mentor</button>
        </div>

        {role ==='intern'?<InternLogin/>:<MentorLogin/>}
    </div>
  )
}

export default Login
