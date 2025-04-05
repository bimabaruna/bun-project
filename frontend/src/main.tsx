import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
// import App from './App.tsx'
import LoginForm from "./LoginForm"
import HomePage from './HomePage'
import ProductList from './components/ProductList'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<HomePage />}>
          <Route index element={<div>Welcome to Home Page!</div>} />
          <Route path="products" element={<ProductList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
