
export interface InitialState {
  payments: Payment[] | null
  newPayment: Payment | null
  editPayment: Payment | null
  deletePayment: Payment | null
  analyzePayment: Payment[] | null
  errorMessage: string
}

export interface Payment {
  id?: number
  title: string
  description: string
  type: Type
  amount: number
  date: string
  categoryId?: number
  userId?: number
  createdDate?: string
  modifiedDate?: string
  split: Split
  splitUserId: number | null
}

export interface RequestPayload {
  title: string
  description: string
  type: Type
  amount: number
  date: string
  categoryId?: number
  userId?: number
  split: Split
  splitUserId: number | null
}

export enum Type {
  EXPENSE = 'expense',
  INCOME = 'income'
}

export interface AnalyzePaymentPayload {
  startDate: string | null
  endDate: string | null
}

export interface DownloadPdfPaymentPayload {
  startDate: string | null
  endDate: string | null
  userId: string
}

export enum Split {
  true = 1,
  false = 0
}