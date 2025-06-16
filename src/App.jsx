import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/Register'
import NotFound from './pages/NotFound';
import ApplyForm from './pages/Intern/ApplyForm';

function App() {
  const user=JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        {user?.role==='intern' &&(
          <>
            <Route path='/intern/dashboard' element={<InternDashboard/>}/>
            <Route path='/intern/applications' element={<Applications/>}/>
            <Route path='/intern/apply' element={<ApplyForm/>}/>
            <Route path='/intern/documents' element={<Documents/>}/>
          </>
        )}

        {user?.role==='mentor'&&(
          <>
            <Route path='/mentor/dashboard' element={<MentorDashboard/>}/>
            <Route path='/mentor/communication' element={<Communications/>}/>
            <Route path='/mentor/track-progress' element={<TrackProgress/>}/>
          </>
        )}

        {/* if not logged in, then redirect everything else to login page */}
        {!user &&(
          <Route path='*' element={<Navigate to='/login' replace />} />
        )}

        {/* if user is logged in but path doesn't match */}
        {user &&(
          <Route path='*' element={<NotFound/>}/>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App
