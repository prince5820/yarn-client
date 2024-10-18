export interface RequestPayload {
  id?: number
  firstName: string
  lastName: string
  email: string
  password?: string
  gender: string
  mobile: string
  dob: string
  profileUrl: string | null
  address: string
}