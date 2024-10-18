export interface InitialState {
  checkUser: User | null
  checkUserError: string | null
  forgetPassword: string
  forgetPasswordError: string
  newUser: User | null
  newUserError: string
}

export interface User {
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