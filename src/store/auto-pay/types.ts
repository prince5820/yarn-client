import { Split, Type } from "../payment/types"

export interface InitialState {
  errorMessage: string
}

export interface RequestPayload {
  title: string
  description: string
  type: Type
  amount: number
  date: number
  categoryId?: number
  userId?: number
  split: Split
  splitUserId: number | null
}

export interface AutoPay {
  id?: number
  title: string
  description: string
  type: Type
  amount: number
  date: number
  categoryId: number
  userId?: number
  createdDate?: string
  modifiedDate?: string
  split: Split
  splitUserId: number | null
}