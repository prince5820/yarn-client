import { AutoPay } from "../../../store/auto-pay/types"
import { Category } from "../../../store/category/types"
import { Contact } from "../../../store/contact/types"
import { Payment } from "../../../store/payment/types"

export interface AddCategoryProps {
  open: boolean
  dialogTitle: string
  buttonName: string
  onClose: () => void
  category?: Category | null
}

export interface DeleteCategoryProps {
  open: boolean
  onClose: () => void
  category?: Category | null
}

export interface DeletePaymentProps {
  open: boolean
  onClose: () => void
  paymentDetail: Payment | null
}

export interface DeleteAutoPayProps {
  open: boolean
  onClose: () => void
  autoPayDetail: AutoPay | null
}

export interface DeleteContactProps {
  open: boolean
  onClose: () => void
  contactDetail: Contact | null
}

export enum PdfDownloadPeriod {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  CUSTOM = 'custom'
}