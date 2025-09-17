import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'

import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import ImportKOL from './pages/Import/ImportKOL'
import KOLList from './pages/KOL/KOLList'
import WorksList from './pages/Works/WorksList'
import Credits from './pages/Credits/Credits'
import CreditHistory from './pages/Credits/CreditHistory'
import { useAuthStore } from './stores/authStore'

const { Content } = Layout

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar />
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 8,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/import" element={<ImportKOL />} />
              <Route path="/kol-list" element={<KOLList />} />
              <Route path="/works-list" element={<WorksList />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/credit-history" element={<CreditHistory />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
