import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Resumes from './pages/Resumes'
import Matches from './pages/Matches'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/settings" element={<Settings />} />
        {/* Placeholder for other routes */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  )
}

export default App
