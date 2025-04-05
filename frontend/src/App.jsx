import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'

// Pages
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'
import Social from './pages/Social'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Layout components
import Navbar from './components/Navbar'

// Auth provider
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/social" element={<Social />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

