import { Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Plus from '../../assets/icon/common/plus.svg?react';
import { EXPENSE_AMOUNT, INCOME_AMOUNT, PATH_TO_ADD_PAYMENT, PATH_TO_PAYMENT_ANALYZE, PATH_TO_PAYMENT_SUMMARY } from "../../common/constants";
import { SNACKBAR_ERROR } from "../../common/message";
import { useAppDispatch } from "../../store";
import { getPayments } from "../../store/payment/thunk";
import { Payment as PaymentResponse, Type } from "../../store/payment/types";
import { setMessage } from "../../store/snackbar/reducer";

const Payment = () => {
  const [getPaymentResponse, setGetPaymentResponse] = useState<PaymentResponse[] | null>(null);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getPaymentList();
  }, []);

  const getPaymentList = async () => {
    if (userId) {
      try {
        const response = await dispatch(getPayments(userId))
        setGetPaymentResponse(response);
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  const goToPaymentSummary = (payment: PaymentResponse) => {
    navigate(PATH_TO_PAYMENT_SUMMARY, { state: { paymentDetail: payment } });
  }

  const goToAddPaymentPage = () => {
    navigate(PATH_TO_ADD_PAYMENT);
  }

  return (
    <Container className="wrapper-payment padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">Payment</Typography>
      <Grid container spacing={1} className="mb-16">
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => navigate(PATH_TO_PAYMENT_ANALYZE)}>Analyze</Button>
        </Grid>
        <Grid item xs={11}>
          <Typography variant="body2" className="payment-text">Payment</Typography>
        </Grid>
        <Grid item xs={1}>
          <Plus className="svg-icon" onClick={goToAddPaymentPage} />
        </Grid>
      </Grid>
      {
        getPaymentResponse?.map((payment) => (
          <Grid container spacing={1} key={payment.id} onClick={() => goToPaymentSummary(payment)} className="mb-16" sx={{ cursor: 'pointer' }}>
            <Grid item xs={11}>
              <Typography variant="body2" className="font-bold">{payment.title}</Typography>
              <Typography variant="body2">{payment.date}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" className={`${payment.type === Type.EXPENSE ? EXPENSE_AMOUNT : INCOME_AMOUNT} font-bold`}>
                {payment.amount}
              </Typography>
            </Grid>
          </Grid>
        ))
      }
    </Container >
  )
}

export default Payment;