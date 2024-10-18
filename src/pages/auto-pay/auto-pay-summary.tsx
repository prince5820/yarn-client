import { Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteAutoPayDialog from "../../common/components/dialog/delete-auto-pay-dialog";
import { EXPENSE_AMOUNT, INCOME_AMOUNT, PATH_TO_AUTO_PAY, PATH_TO_EDIT_AUTO_PAY } from "../../common/constants";
import { SNACKBAR_ERROR } from "../../common/message";
import { useAppDispatch } from "../../store";
import { getAutoPayById } from "../../store/auto-pay/thunk";
import { AutoPay } from "../../store/auto-pay/types";
import { Split, Type } from "../../store/payment/types";
import { getUserById } from "../../store/profile/thunk";
import { setMessage } from "../../store/snackbar/reducer";

const AutoPaySummary = () => {
  const { paymentId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [paymentDetail, setPaymentDetail] = useState<AutoPay | null>(null);
  const [splitUserName, setSplitUserName] = useState<string>('');
  const split = paymentDetail?.split === Split.true ? 'True' : 'False';
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    getAutoPayByPaymentId();
  }, []);

  const getAutoPayByPaymentId = async () => {
    if (paymentId) {
      try {
        const response = await dispatch(getAutoPayById(parseInt(paymentId)));
        setPaymentDetail(response[0]);
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  }

  useEffect(() => {
    const getSplitUserName = async () => {
      if (paymentDetail?.splitUserId) {
        try {
          const response = await dispatch(getUserById(paymentDetail?.splitUserId?.toString()));
          const fullName = `${response[0].firstName} ${response[0].lastName}`;
          setSplitUserName(fullName);
        } catch (err) {
          dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
        }
      }
    }

    getSplitUserName();
  }, [paymentDetail?.splitUserId]);

  const goToEditAutoPay = () => {
    navigate(`${PATH_TO_EDIT_AUTO_PAY}/${paymentDetail?.id}`);
  }

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  }

  return (
    <>
      <Container className="wrapper-payment-summary padding-wrapper-for-non-auth max-width-wrapper">
        <Typography variant="h6" className="text-center mb-16">Auto Pay Summary</Typography>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography className="payment-detail-title">Title</Typography>
            <Typography variant="body2">{paymentDetail?.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className="payment-detail-title">Description</Typography>
            <Typography variant="body2">{paymentDetail?.description}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className="payment-detail-title">Type</Typography>
            <Typography variant="body2">{paymentDetail?.type}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className="payment-detail-title">Amount</Typography>
            <Typography variant="body2" className={`${paymentDetail?.type === Type.EXPENSE ? EXPENSE_AMOUNT : INCOME_AMOUNT}`}>{paymentDetail?.amount}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className="payment-detail-title">Date</Typography>
            <Typography variant="body2">{paymentDetail?.date}</Typography>
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
            <Button variant="contained" onClick={() => navigate(PATH_TO_AUTO_PAY)}>Back</Button>
            <Button variant="contained" onClick={goToEditAutoPay}>Edit</Button>
            <Button variant="contained" onClick={handleDelete}>Delete</Button>
          </Grid>
        </Grid>
      </Container>
      <DeleteAutoPayDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        autoPayDetail={paymentDetail}
      />
    </>
  )
}

export default AutoPaySummary;