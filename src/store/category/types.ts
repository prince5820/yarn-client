export interface Category {
  id?: number;
  userId: number;
  categoryName: string;
  shortName: string;
}

export interface InitialState {
  categories: Category[] | null
  addCategory: Category | null
  editCategory: string
  deleteCategory: string
  errorMessage: string
}