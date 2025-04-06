import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './colors.css'
import './App.css'

// Pages
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'
import Social from './pages/Social'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'

// Layout components
import Navbar from './components/Navbar'

// Auth provider
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import {
  PrivateRoute,
  PublicOnlyRoute,
} from './routes/ProtectedRoutes';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
              <Route path='/' element={<Navbar />} >
                  {/* Redirect from root to home or login depending on auth status */}
                  <Route index element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route element={<PrivateRoute />}>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/social" element={<Social />} />
                        <Route path="/profile/:id" element={<Profile />} />
                  </Route>
                  <Route element={<PublicOnlyRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Route>
              </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
