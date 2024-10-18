import { Container, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from '../../assets/icon/common/back.svg?react';
import Rupee from '../../assets/icon/common/rupee.svg?react';
import { EXPENSE_AMOUNT, INCOME_AMOUNT, PATH_TO_CHAT_SUMMARY, PATH_TO_ROOT_ROUTE, PATH_TO_TRANSACTION_SUMMARY } from "../../common/constants";
import { SNACKBAR_ERROR } from "../../common/message";
import { useAppDispatch } from "../../store";
import { getTransactionsByUser } from "../../store/chat/thunk";
import { Payment, Type } from "../../store/payment/types";
import { setMessage } from "../../store/snackbar/reducer";

const ChatTransaction = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;
  const [transactions, setTransactions] = useState<Payment[] | null>(null);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();

  const transactionContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!state) {
      navigate(PATH_TO_ROOT_ROUTE);
    }
  }, [state]);

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    if (transactionContainerRef.current) {
      transactionContainerRef.current.scrollTop = transactionContainerRef.current.scrollHeight;
    }
  }, [transactions]);

  const getTransactions = async () => {
    if (userId && user) {
      const requestPayload = {
        senderId: user.id,
        receiverId: parseInt(userId)
      }

      try {
        const response = await dispatch(getTransactionsByUser(requestPayload));
        setTransactions(response);
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  }

  const handleNavigateTransactionSummary = (transaction: Payment) => {
    navigate(PATH_TO_TRANSACTION_SUMMARY, { state: { transaction, user } });
  }

  return (
    user ? (
      <Container className="wrapper-chat-summary padding-wrapper-for-non-auth max-width-wrapper">
        <Grid container spacing={1} className="chat-summary-header-section">
          <Grid item xs={1}>
            <BackIcon className="svg-icon" onClick={() => navigate(PATH_TO_CHAT_SUMMARY, { state: { user: user } })} />
          </Grid>
          <Grid item xs={1}>
            <img src={user.profileUrl || "/src/assets/image/login.png"} className="chat-summary-image" alt="chat-summary-image" />
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
          </Grid>
        </Grid>
        <Container ref={transactionContainerRef} className="transaction-container">
          {
            transactions && transactions.map((transaction: Payment, index: number) => (
              <Grid container spacing={1} key={index} className={`transaction-box ${userId && transaction.userId === parseInt(userId) ? 'sent' : 'received'}`} onClick={() => handleNavigateTransactionSummary(transaction)} sx={{ cursor: 'pointer' }}>
                <Grid item xs={12}>
                  <div className="transaction-details">
                    <Typography variant="h4" className={`transaction-amount ${transaction.type === Type.EXPENSE ? EXPENSE_AMOUNT : INCOME_AMOUNT}`}>
                      <Rupee className="svg-icon" /> {transaction.amount}
                    </Typography>
                    <Typography variant="body2" className="transaction-date">
                      {transaction.date}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            ))
          }
        </Container>
      </Container>
    ) : (
      <></>
    )
  )
}

export default ChatTransaction;