import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DeletePaymentProps } from "./types";
import { useAppDispatch } from "../../../store";
import { deletePayment } from "../../../store/payment/thunk";
import { setMessage } from "../../../store/snackbar/reducer";
import { MESSAGE_PAYMENT_DELETE_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../message";
import { useNavigate } from "react-router-dom";
import { PATH_TO_PAYMENT } from "../../constants";

const DeletePaymentDialog = ({ open, onClose, paymentDetail }: DeletePaymentProps) => {
  const paymentId = paymentDetail?.id
  const userId = paymentDetail?.userId;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeDeletePaymentDialog = () => {
    onClose();
  }

  const handleCloseDeletePaymentDialog = (_event: any, reason: any) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    closeDeletePaymentDialog();
  }

  const handleDeletePayment = async () => {
    if (paymentId && userId) {
      try {
        const response = await dispatch(deletePayment(paymentId, userId))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_PAYMENT_DELETE_SUCCESS, className: SNACKBAR_SUCCESS }));
          navigate(PATH_TO_PAYMENT);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDeletePaymentDialog}>
      <DialogTitle>Delete Payment</DialogTitle>
      <DialogContent>Are You Sure to Delete Payment?</DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={closeDeletePaymentDialog}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDeletePayment}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePaymentDialog;