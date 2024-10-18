export interface InitialState {
  contact: Contact[] | null
  newContact: MysqlResult | null
  editContact: MysqlResult | null
  deleteContact: MysqlResult | null
  errorMessage: string
}

export interface Contact {
  id: number
  firstName: string
  lastName: string
  mobile: string
  email: string
  profileUrl: string | null
  active: ActiveStatus
  userId: number
  createdDate: string
  modifiedDate: string | null
}

export interface MysqlResult {
  fieldCount: number
  affectedRows: number
  insertId: number
  serverStatus: number
  warningCount: number
  message: string
  protocol41: boolean
  changedRows: number
}

export interface RequestPayload {
  firstName: string
  lastName: string
  mobile: string
  email: string
  profileUrl: string | null
  active: ActiveStatus
  userId?: number
}

export enum ActiveStatus {
  Active = 1,
  Inactive = 0
}