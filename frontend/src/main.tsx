import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
// import App from './App.tsx'
import LoginForm from "./LoginForm"
import HomePage from './HomePage'
import ProductList from './pages/ProductList'
import CreateProduct from './pages/CreateProduct'
import ProductDetails from './pages/ProductDetails'
import OutletList from './pages/OutletList'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<HomePage />}>
          <Route index element={<div>Welcome to Home Page!</div>} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create-product" element={<CreateProduct />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="outlets" element={<OutletList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
