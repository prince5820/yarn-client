import { Button, Container, Grid, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { Split, Type } from "../../store/payment/types";
import { EXPENSE_AMOUNT, INCOME_AMOUNT, PATH_TO_EDIT_PAYMENT, PATH_TO_PAYMENT, PATH_TO_ROOT_ROUTE } from "../../common/constants";
import { useEffect, useState } from "react";
import DeletePaymentDialog from "../../common/components/dialog/delete-payment-dialog";
import { useAppDispatch } from "../../store";
import { getUserById } from "../../store/profile/thunk";
import { setMessage } from "../../store/snackbar/reducer";
import { SNACKBAR_ERROR } from "../../common/message";

const PaymentSummary = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const { state } = useLocation();
  const { paymentDetail } = state;
  const navigate = useNavigate();
  const split = paymentDetail.split === Split.true ? 'True' : 'False';
  const dispatch = useAppDispatch();
  const [splitUserName, setSplitUserName] = useState<string>('');

  useEffect(() => {
    if (!state) {
      navigate(PATH_TO_ROOT_ROUTE);
    }
  }, [state]);

  useEffect(() => {
    const getSplitUserName = async () => {
      try {
        const response = await dispatch(getUserById(paymentDetail.splitUserId));
        const fullName = `${response[0].firstName} ${response[0].lastName}`;
        setSplitUserName(fullName);
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }

    getSplitUserName();
  }, [paymentDetail.splitUserId]);

  const goToPaymentPage = () => {
    navigate(PATH_TO_PAYMENT);
  }

  const goToAddPaymentPage = () => {
    navigate(PATH_TO_EDIT_PAYMENT, { state: { paymentDetail: paymentDetail } });
  }

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  }

  return (
    <>
      <Container className="wrapper-payment-summary padding-wrapper-for-non-auth max-width-wrapper">
        <Typography variant="h6" className="text-center mb-16">Payment Summary</Typography>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography className="payment-detail-title">Title</Typography>
            <Typography variant="body2">{paymentDetail.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className="payment-detail-title">Description</Typography>
            <Typography variant="body2">{paymentDetail.description}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className="payment-detail-title">Type</Typography>
            <Typography variant="body2">{paymentDetail.type}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className="payment-detail-title">Amount</Typography>
            <Typography variant="body2" className={`${paymentDetail.type === Type.EXPENSE ? EXPENSE_AMOUNT : INCOME_AMOUNT}`}>{paymentDetail.amount}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className="payment-detail-title">Date</Typography>
            <Typography variant="body2">{paymentDetail.date}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="payment-detail-title">Split</Typography>
            <Typography variant="body2">{split}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="payment-detail-title">Split User</Typography>
            <Typography variant="body2">{splitUserName}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="contained" onClick={goToPaymentPage}>Back</Button>
            <Button variant="contained" onClick={goToAddPaymentPage}>Edit</Button>
            <Button variant="contained" onClick={handleDelete}>Delete</Button>
          </Grid>
        </Grid>
      </Container>
      <DeletePaymentDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        paymentDetail={paymentDetail}
      />
    </>
  )
}

export default PaymentSummary