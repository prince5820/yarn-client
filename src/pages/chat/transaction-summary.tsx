import { Container, Grid, Typography } from "@mui/material";
import BackIcon from '../../assets/icon/common/back.svg?react';
import { useLocation, useNavigate } from "react-router-dom";
import { PATH_TO_CHAT_TRANSACTION, PATH_TO_ROOT_ROUTE } from "../../common/constants";
import { useEffect } from "react";

const TransactionSummary = () => {
  const { state } = useLocation();
  const transaction = state?.transaction;
  const user = state?.user;
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate(PATH_TO_ROOT_ROUTE);
    }
  }, [state]);

  const handleNavigateTransaction = () => {
    navigate(PATH_TO_CHAT_TRANSACTION, { state: { transaction, user } });
  }

  return (
    transaction ? (
      <Container className="padding-wrapper-for-non-auth max-width-wrapper">
        <Grid container spacing={1} className="mb-16">
          <Grid item xs={1}>
            <BackIcon className="svg-icon" style={{ cursor: 'pointer' }} onClick={handleNavigateTransaction} />
          </Grid>
          <Grid item xs={11}>
            <Typography variant="h6" className="text-center mb-16" sx={{ lineHeight: 1.3 }}>Transaction Summary</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Typography className="transaction-title">Type</Typography>
            <Typography variant="body2">{transaction.type}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="transaction-title">Amount</Typography>
            <Typography variant="body2">{transaction.amount}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="transaction-title">Title</Typography>
            <Typography variant="body2">{transaction.title}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="transaction-title">Date</Typography>
            <Typography variant="body2">{transaction.date}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className="transaction-title">Description</Typography>
            <Typography variant="body2">{transaction.description}</Typography>
          </Grid>
        </Grid>
      </Container>
    ) : (
      <></>
    )
  )
}

export default TransactionSummary;