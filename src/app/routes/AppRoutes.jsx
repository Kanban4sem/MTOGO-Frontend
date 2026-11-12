// Pathing
// _______
// src/app/routes/AppRoutes.jsx

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import LoginPage from '@/app/pages/LoginPage.jsx'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
