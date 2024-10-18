import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DeleteContactProps } from "./types";
import { useAppDispatch } from "../../../store";
import { useNavigate } from "react-router-dom";
import { deleteContact } from "../../../store/contact/thunk";
import { setMessage } from "../../../store/snackbar/reducer";
import { MESSAGE_CONTACT_DELETE_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../message";
import { PATH_TO_CONTACT } from "../../constants";

const DeleteContactDialog = ({ open, onClose, contactDetail }: DeleteContactProps) => {
  const contactId = contactDetail?.id.toString();
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeDeleteContactDialog = () => {
    onClose();
  }

  const handleCloseDeleteContactDialog = (_event: any, reason: any) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    closeDeleteContactDialog();
  }

  const handleDeleteContact = async () => {
    if (contactId && userId) {
      try {
        const response = await dispatch(deleteContact(contactId, userId))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_CONTACT_DELETE_SUCCESS, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_CONTACT);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDeleteContactDialog}>
      <DialogTitle>Delete Contact</DialogTitle>
      <DialogContent>Are You Sure to Delete Contact?</DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={closeDeleteContactDialog}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDeleteContact}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteContactDialog;