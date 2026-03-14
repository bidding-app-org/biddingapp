import api from './client'
import type { Bid, BidRequest } from '../types/api'

export async function listBids(productId: number): Promise<Bid[]> {
  const res = await api.get<Bid[]>(`/products/${productId}/bids`)
  return res.data
}

export async function placeBid(productId: number, request: BidRequest): Promise<Bid> {
  const res = await api.post<Bid>(`/products/${productId}/bids`, request)
  return res.data
}
