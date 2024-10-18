import { User } from "../auth/types";

export interface InitialState {
  userProfile: User | null
  errorMessage: string
}