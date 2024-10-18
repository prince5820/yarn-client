import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { deleteAutoPay } from "../../../store/auto-pay/thunk";
import { setMessage } from "../../../store/snackbar/reducer";
import { PATH_TO_AUTO_PAY } from "../../constants";
import { MESSAGE_AUTO_PAY_DELETE_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../message";
import { DeleteAutoPayProps } from "./types";

const DeleteAutoPayDialog = ({ open, onClose, autoPayDetail }: DeleteAutoPayProps) => {
  const paymentId = autoPayDetail?.id
  const userId = autoPayDetail?.userId;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeDeleteAutoPayDialog = () => {
    onClose();
  }

  const handleCloseDeleteAutoPayDialog = (_event: any, reason: any) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    closeDeleteAutoPayDialog();
  }

  const handleDeleteAutoPay = async () => {
    if (paymentId && userId) {
      try {
        const response = await dispatch(deleteAutoPay(paymentId, userId))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_AUTO_PAY_DELETE_SUCCESS, className: SNACKBAR_SUCCESS }));
          navigate(PATH_TO_AUTO_PAY);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDeleteAutoPayDialog}>
      <DialogTitle>Delete Auto Pay</DialogTitle>
      <DialogContent>Are You Sure to Delete Auto Pay?</DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={closeDeleteAutoPayDialog}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDeleteAutoPay}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteAutoPayDialog;