import { PdfDownloadPeriod } from "../../common/components/dialog/types";
import { User } from "../auth/types";

export interface InitialState {
  userList: User[] | null
  sentMailPdf: string
  errorMessage: string
}

export interface Message {
  id: number
  messageText: string | null
  messageDateTime: string
  senderId: number
  receiverId: number
  isRead: IsRead
  fileName: string | null
  filePath: string | null
  fileType: string | null
  fileData?: any
}

export enum IsRead {
  true = 1,
  false = 0
}

export interface PdfRequestPayload {
  startDate: string
  endDate: string
  senderId: number
  user: User
  selectedOption?: PdfDownloadPeriod
}

export interface TransactionRequestPayload {
  senderId: number
  receiverId: number
}