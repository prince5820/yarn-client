import { Container, Grid, Typography } from "@mui/material";
import Plus from '../../assets/icon/common/plus.svg?react';
import { useNavigate } from "react-router-dom";
import { EXPENSE_AMOUNT, INCOME_AMOUNT, PATH_TO_ADD_AUTO_PAY, PATH_TO_AUTO_PAY_SUMMARY } from "../../common/constants";
import { useAppDispatch } from "../../store";
import { getAutoPay } from "../../store/auto-pay/thunk";
import { useEffect, useState } from "react";
import { Payment, Type } from "../../store/payment/types";
import { setMessage } from "../../store/snackbar/reducer";
import { SNACKBAR_ERROR } from "../../common/message";

const AutoPay = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const [autoPay, setAutoPay] = useState<Payment[] | null>(null);

  useEffect(() => {
    getAutoPayById();
  }, []);

  const getAutoPayById = async () => {
    if (userId) {
      try {
        const response = await dispatch(getAutoPay(parseInt(userId)));
        setAutoPay(response);
      } catch (err) {
        setMessage({ msg: err, className: SNACKBAR_ERROR });
      }
    }
  }

  const goToAddAutoPayPage = () => {
    navigate(PATH_TO_ADD_AUTO_PAY);
  }

  const handleNavigateAutoPaySummary = (payment: Payment) => {
    if (payment.id) {
      navigate(`${PATH_TO_AUTO_PAY_SUMMARY}/${payment.id}`);
    }
  }

  return (
    <Container className="padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">Auto Pay</Typography>
      <Grid container spacing={1} className="mb-16">
        <Grid item xs={11}>
          <Typography variant="body2" style={{ fontWeight: 900 }}>Auto Pay</Typography>
        </Grid>
        <Grid item xs={1}>
          <Plus className="svg-icon" onClick={goToAddAutoPayPage} />
        </Grid>
      </Grid>
      {
        autoPay && autoPay.map((payment) => (
          <Grid container spacing={1} key={payment.id} onClick={() => handleNavigateAutoPaySummary(payment)} className="mb-16" sx={{ cursor: 'pointer' }}>
            <Grid item xs={11}>
              <Typography variant="body2" className="font-bold">{payment.title}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" className={`${payment.type === Type.EXPENSE ? EXPENSE_AMOUNT : INCOME_AMOUNT} font-bold`}>
                {payment.amount}
              </Typography>
            </Grid>
          </Grid>
        ))
      }
    </Container>
  )
}

export default AutoPay;