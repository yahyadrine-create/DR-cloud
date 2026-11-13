import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Drive from './pages/Drive'
import ProtectedRoutr from './components/auth/ProtectedRoutr'
import DashboardLayout from './components/layout/DashboardLayout'
import SharedFile from './pages/SharedFile'
import Trash from './pages/Trash'
import SharedForMe from './pages/SharedForMe'
const App = () => {
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path="/login" element={<Login mode="login"/>}/>
      <Route path="/registre" element={<Login mode="registre"/>}/>
      <Route path="/s/:token" element={<SharedForMe/>}/>
      {/* Private routes */}
      <Route element={<ProtectedRoutr />} >
        <Route element={<DashboardLayout/>}>
          <Route path="/" element={<Drive/>}/>
          <Route path="/drive/:folderId" element={<Drive/>}/>
          <Route path="/shared" element={<SharedFile/>}/>
          <Route path="/trash" element={<Trash/>}/>
        </Route>
      </Route>
      

      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
    </>
  )
}

export default App