import React,{ useState } from 'react'
import Login from './pages/login'
import Register from './pages/Register'

function App() {
  const [isLogin,setIsLogin]=useState(true);

  return (
    <div style={{padding:'20px'}}>
      {isLogin ? <Login/> : <Register/>}
      <button onClick={()=>setIsLogin(!isLogin)} style={{backgroundColor:'#007bff',color:'white',cursor:'pointer',marginTop:'20px',padding:'10px 20px',borderRadius:'5px'}}>
        {isLogin ? 'Go to Register':'Back to Login'}
      </button>
    </div>
  );
}

export default App
