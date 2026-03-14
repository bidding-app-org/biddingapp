export type ProductStatus = 'ACTIVE' | 'SOLD'

export interface ProductResponse {
  id: number
  sellerName: string
  name: string
  description: string
  startingPrice: string
  currentPrice: string
  endTime: string
  status: ProductStatus
  imageFilename: string | null
}

export interface Bid {
  id: number
  amount: string
  createdAt: string
  bidderName: string | null
}

export interface BidRequest {
  amount: number
  bidderName?: string
}
