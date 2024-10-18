import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { AddCategoryProps } from "./types";
import { useAppDispatch } from "../../../store";
import { addCategory, editCategory } from "../../../store/category/thunk";
import { Category } from "../../../store/category/types";
import { setMessage } from "../../../store/snackbar/reducer";
import { MESSAGE_CATEGORY_ADD_SUCCESS, MESSAGE_CATEGORY_EDIT_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../message";

const AddCategoryDialog = ({ open, dialogTitle, buttonName, onClose, category }: AddCategoryProps) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [initialCategoryName, setInitialCategoryName] = useState<string>('');
  const [initialShortName, setInitialShortName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open && category) {
      setCategoryName(category.categoryName);
      setShortName(category.shortName);
      setInitialCategoryName(category.categoryName);
      setInitialShortName(category.shortName);
    }
    if (!open) {
      setCategoryName('');
      setShortName('');
      setIsSubmitted(false);
      setInitialCategoryName('');
      setInitialShortName('');
    }
  }, [open, category]);

  const isFormChanged = categoryName !== initialCategoryName || shortName !== initialShortName;
  const isFormValid = categoryName && shortName;

  const closeAddCategoryDialog = () => {
    setCategoryName('');
    setShortName('');
    setIsSubmitted(false);
    onClose();
  }

  const handleCloseAddCategoryDialog = (_event: any, reason: any) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    closeAddCategoryDialog();
  }

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (dialogTitle === 'Add Category' && buttonName === 'Add') {
      if (categoryName && shortName && userId) {
        const requestPayload: Category = {
          userId: parseInt(userId),
          categoryName: categoryName,
          shortName: shortName
        }

        try {
          const response = await dispatch(addCategory(requestPayload))
          if (response) {
            dispatch(setMessage({ msg: MESSAGE_CATEGORY_ADD_SUCCESS, className: SNACKBAR_SUCCESS }))
            closeAddCategoryDialog();
          }
        } catch (err) {
          dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
        }
      }
    } else if (dialogTitle === 'Edit Category' && buttonName === 'Edit') {
      if (categoryName && shortName && userId && category?.id) {
        const requestPayload: Category = {
          userId: parseInt(userId),
          categoryName: categoryName,
          shortName: shortName
        }

        try {
          const response = await dispatch(editCategory(category.id.toString(), requestPayload))
          if (response) {
            dispatch(setMessage({ msg: MESSAGE_CATEGORY_EDIT_SUCCESS, className: SNACKBAR_SUCCESS }))
            closeAddCategoryDialog();
          }
        } catch (err) {
          dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
        }
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseAddCategoryDialog}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <InputLabel className="input-label">Category Name</InputLabel>
        <FormControl fullWidth variant="outlined">
          <TextField
            type="text"
            variant="outlined"
            placeholder="Category Name"
            name="categoryName"
            value={categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            onChange={(e) => setCategoryName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            error={isSubmitted && !categoryName}
            helperText={isSubmitted && !categoryName && 'Enter Category Name'}
            inputProps={{
              maxLength: 55
            }}
          />
        </FormControl>
        <InputLabel className="input-label">Short Name</InputLabel>
        <FormControl fullWidth variant="outlined">
          <TextField
            type="text"
            variant="outlined"
            placeholder="Short Name"
            name="shortName"
            value={shortName.toUpperCase()}
            onChange={(e) => setShortName(e.target.value.toUpperCase())}
            error={isSubmitted && !shortName}
            helperText={isSubmitted && !shortName && 'Enter Short Name'}
            inputProps={{
              maxLength: 55
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={closeAddCategoryDialog}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid || !isFormChanged}>
          {buttonName}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCategoryDialog;