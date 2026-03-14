import api from './client'
import type { ProductResponse } from '../types/api'

export async function listProducts(): Promise<ProductResponse[]> {
  const res = await api.get<ProductResponse[]>('/products')
  return res.data
}

export async function getProduct(id: number): Promise<ProductResponse> {
  const res = await api.get<ProductResponse>(`/products/${id}`)
  return res.data
}

export async function listSellerProducts(sellerName: string): Promise<ProductResponse[]> {
  const res = await api.get<ProductResponse[]>(`/sellers/${encodeURIComponent(sellerName)}/products`)
  return res.data
}

export async function createProduct(form: FormData): Promise<ProductResponse> {
  const res = await api.post<ProductResponse>('/products', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export async function updateProduct(id: number, form: FormData): Promise<ProductResponse> {
  const res = await api.put<ProductResponse>(`/products/${id}`, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export async function deleteProduct(id: number, sellerName: string): Promise<void> {
  await api.delete(`/products/${id}`, {
    params: {
      sellerName,
    },
  })
}
