// import { useState } from 'react'
import Login_page from  './pages/LoginPage'
import DashboardPage from './pages/Dashboard'
import ProjectDetailPage from './pages/ProjectDetailPage'
import './App.css'
import { Route ,Routes} from 'react-router-dom'


function App() {
 

  return (
    <>
    {/* <Login_page/> */}
    <Routes>
      <Route path="/login" element={<Login_page/>} />
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/projectDetail" element={<ProjectDetailPage/>} />

    </Routes>
    </>
  )
}

export default App
