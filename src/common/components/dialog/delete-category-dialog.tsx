import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DeleteCategoryProps } from "./types";
import { useAppDispatch } from "../../../store";
import { deleteCategory } from "../../../store/category/thunk";
import { setMessage } from "../../../store/snackbar/reducer";
import { MESSAGE_CATEGORY_DELETE_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../message";

const DeleteCategoryDialog = ({ open, onClose, category }: DeleteCategoryProps) => {
  const dispatch = useAppDispatch();

  const closeDeleteCategoryDialog = () => {
    onClose();
  }

  const handleCloseDeleteCategoryDialog = (_event: any, reason: any) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    closeDeleteCategoryDialog();
  }

  const handleDeleteCategory = async () => {
    if (category?.id && category.userId) {
      try {
        const response = await dispatch(deleteCategory(category.id.toString(), category.userId.toString()))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_CATEGORY_DELETE_SUCCESS, className: SNACKBAR_SUCCESS }))
          closeDeleteCategoryDialog();
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDeleteCategoryDialog}>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>Are You Sure to Delete Category?</DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={closeDeleteCategoryDialog}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDeleteCategory}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCategoryDialog;