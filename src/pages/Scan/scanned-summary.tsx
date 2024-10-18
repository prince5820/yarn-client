import { Button, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Category } from "../../store/category/types";
import { useAppDispatch } from "../../store";
import { getCategories } from "../../store/category/thunk";
import { setMessage } from "../../store/snackbar/reducer";
import { MESSAGE_PAYMENT_ADD_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";
import { CHECK_REGEX_AMOUNT, PATH_TO_CHAT_TRANSACTION, PATH_TO_ROOT_ROUTE, PATH_TO_SCAN } from "../../common/constants";
import { RequestPayload, Split, Type } from "../../store/payment/types";
import dayjs from "dayjs";
import { addPayment } from "../../store/payment/thunk";

const ScannedSummary = () => {
  const { state } = useLocation();
  const { userDetail } = state;
  const userName = `${userDetail.firstName} ${userDetail.lastName}`;
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryList, setCategoryList] = useState<Category[] | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate(PATH_TO_ROOT_ROUTE);
    }
  }, [state]);

  useEffect(() => {
    if (userId) {
      const categories = async () => {
        try {
          const response = await dispatch(getCategories(userId))
          setCategoryList(response);
        } catch (err) {
          dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
        }
      }

      categories();
    }
  }, [dispatch, userId]);

  const checkAmount = (value: string) => {
    if (CHECK_REGEX_AMOUNT.test(value) || value === '') {
      setAmount(value);
    }
  }

  useEffect(() => {
    if (title && description && amount && selectedCategory) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [title, description, amount, selectedCategory]);

  const handleSendButton = async () => {
    setIsSubmitted(true);
    const type = Type.EXPENSE;
    const date = dayjs().format('YYYY-MM-DD');
    const split = Split.true;

    if (title && description && amount && date && selectedCategory && userId && userDetail && split && type) {
      const requestPayload: RequestPayload = {
        title,
        description,
        type,
        amount: parseInt(amount),
        date,
        categoryId: parseInt(selectedCategory),
        userId: parseInt(userId),
        split,
        splitUserId: userDetail.id
      }

      try {
        const response = await dispatch(addPayment(requestPayload))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_PAYMENT_ADD_SUCCESS, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_CHAT_TRANSACTION, { state: { user: userDetail } });
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    userDetail ? (
      <Container className="wrapper-payment-summary padding-wrapper-for-non-auth max-width-wrapper">
        <Typography variant="h6" className="text-center mb-16">User Details</Typography>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Typography className="payment-detail-title">Username</Typography>
            <Typography variant="body2">{userName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="payment-detail-title">Mobile</Typography>
            <Typography variant="body2">{userDetail.mobile}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="payment-detail-title">Email</Typography>
            <Typography variant="body2">{userDetail.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="payment-detail-title">Gender</Typography>
            <Typography variant="body2">{userDetail.gender}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className="payment-detail-title">Address</Typography>
            <Typography variant="body2">{userDetail.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <InputLabel className="input-label">Title</InputLabel>
            <FormControl fullWidth variant="outlined">
              <TextField
                type="text"
                variant="outlined"
                placeholder="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={isSubmitted && !title}
                helperText={isSubmitted && !title && 'Enter Title'}
                inputProps={{
                  maxLength: 55
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <InputLabel className="input-label">Description</InputLabel>
            <FormControl fullWidth variant="outlined">
              <TextField
                multiline
                rows={5}
                type="text"
                variant="outlined"
                placeholder="Description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={isSubmitted && !description}
                helperText={isSubmitted && !description && 'Enter Description'}
                inputProps={{
                  maxLength: 255
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <InputLabel className="input-label">Amount</InputLabel>
            <FormControl fullWidth variant="outlined">
              <TextField
                type="text"
                variant="outlined"
                placeholder="Amount"
                name="amount"
                value={amount}
                onChange={(e) => checkAmount(e.target.value)}
                error={isSubmitted && !amount}
                helperText={isSubmitted && !amount && 'Enter Amount'}
                inputProps={{
                  maxLength: 11
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <InputLabel className="input-label">Category</InputLabel>
            <FormControl fullWidth variant="outlined">
              <Select
                variant="outlined"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                renderValue={(val) => {
                  if (val === '') return 'Select Category';
                  const selected = categoryList?.find((category) => category.id === parseInt(val));
                  return selected ? selected.categoryName : 'Select Category';
                }}
                displayEmpty
                error={isSubmitted && !selectedCategory}
              >
                {categoryList?.map((category) => (
                  <MenuItem value={category.id} key={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {isSubmitted && !selectedCategory && (
                <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>
                  Select Category
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="contained" onClick={() => navigate(PATH_TO_SCAN)}>Back</Button>
            <Button variant="contained" onClick={handleSendButton} disabled={disabled}>Send</Button>
          </Grid>
        </Grid>
      </Container>
    ) : (
      <></>
    )
  )
}

export default ScannedSummary;