import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import SellerDashboardPage from './pages/SellerDashboardPage'
import AddProductPage from './pages/AddProductPage'
import EditProductPage from './pages/EditProductPage'
import NotFoundPage from './pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/seller" element={<SellerDashboardPage />} />
        <Route path="/seller/add" element={<AddProductPage />} />
        <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
