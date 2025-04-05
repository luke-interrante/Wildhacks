import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'

// Pages
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'
import Social from './pages/Social'
import Login from './pages/Login'

// Layout components
import Navbar from './components/Navbar'

export default function App() {
  return (
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

