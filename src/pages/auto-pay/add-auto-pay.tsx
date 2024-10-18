import { Button, Checkbox, Container, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CHECK_REGEX_AMOUNT, PATH_TO_AUTO_PAY, PATH_TO_AUTO_PAY_SUMMARY } from "../../common/constants";
import { MESSAGE_AUTO_PAY_EDIT_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";
import { useAppDispatch } from "../../store";
import { User } from "../../store/auth/types";
import { addAutoPayment, editAutoPayment, getAutoPayById } from "../../store/auto-pay/thunk";
import { AutoPay, RequestPayload } from "../../store/auto-pay/types";
import { getCategories } from "../../store/category/thunk";
import { Category } from "../../store/category/types";
import { getUsersList } from "../../store/chat/thunk";
import { Split, Type } from "../../store/payment/types";
import { setMessage } from "../../store/snackbar/reducer";

const AddAutoPay = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedType, setSelectedType] = useState<Type | ''>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[] | null>(null);
  const [split, setSplit] = useState<Split>(Split.false);
  const [splitUserId, setSplitUserId] = useState<string>('');
  const [splitUserList, setSplitUserList] = useState<User[] | null>(null);
  const [autoPayById, setAutoPayById] = useState<AutoPay | null>(null);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { paymentId } = useParams();

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

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (split === Split.false) {
      setSplitUserId('');
    }
  }, [split]);

  useEffect(() => {
    if (paymentId && autoPayById) {
      if (
        (title &&
          description &&
          selectedType &&
          amount &&
          date &&
          selectedCategory) &&
        (title !== autoPayById.title ||
          description !== autoPayById.description ||
          selectedType !== autoPayById.type ||
          amount.toString() !== autoPayById.amount.toString() ||
          date.toString() !== autoPayById.date.toString() ||
          selectedCategory.toString() !== autoPayById.categoryId.toString())) {
        setDisabled(false)
      } else {
        setDisabled(true);
      }
    }
  }, [title, description, selectedType, amount, date, selectedCategory, paymentId, autoPayById]);

  useEffect(() => {
    const areRequiredFieldsFilled = title && description && selectedType && amount && date && selectedCategory;

    if (split === Split.true) {
      if (areRequiredFieldsFilled && splitUserId) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      if (areRequiredFieldsFilled) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  }, [title, description, selectedType, amount, date, selectedCategory, split, splitUserId, disabled]);

  useEffect(() => {
    if (paymentId) {
      const getAutoPayByPaymentId = async () => {
        if (paymentId) {
          try {
            const response = await dispatch(getAutoPayById(parseInt(paymentId)));
            setAutoPayById(response[0]);
            setTitle(response[0].title);
            setDescription(response[0].description);
            setSelectedType(response[0].type);
            setAmount(response[0].amount);
            setDate(response[0].date);
            setSelectedCategory(response[0].categoryId);
            setSplit(response[0].split);
            setSplitUserId(response[0].splitUserId);
          } catch (err) {
            dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
          }
        }
      }

      getAutoPayByPaymentId();
    } else {
      setTitle('')
      setDescription('')
      setSelectedType('')
      setAmount('')
      setDate('');
      setSelectedCategory('')
      setSplit(Split.false);
      setSplitUserId('');
    }
  }, [paymentId]);

  const getUsers = async () => {
    try {
      const response = await dispatch(getUsersList());
      if (response) {
        const filteredUsers = response.filter((user: User) => user.id?.toString() !== userId);
        setSplitUserList(filteredUsers);
      }
    } catch (err) {
      dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
    }
  };

  const checkAmount = (value: string) => {
    if (CHECK_REGEX_AMOUNT.test(value) || value === '') {
      setAmount(value);
    }
  }

  const checkDate = (value: string) => {
    if (value === '' || CHECK_REGEX_AMOUNT.test(value)) {
      if (value === '' || (value >= '1' && value <= '31')) {
        setDate(value);
      }
    }
  }

  const handleSplitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSplit(e.target.checked ? Split.true : Split.false);
  }

  const handleCancel = () => {
    if (paymentId) {
      navigate(`${PATH_TO_AUTO_PAY_SUMMARY}/${paymentId}`);
    } else {
      navigate(PATH_TO_AUTO_PAY);
    }
  }

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (title && description && selectedType && amount && date && selectedCategory && userId) {
      const requestPayload: RequestPayload = {
        title,
        description,
        type: selectedType,
        amount: parseInt(amount),
        date: parseInt(date),
        categoryId: parseInt(selectedCategory),
        userId: parseInt(userId),
        split,
        splitUserId: split === Split.true ? parseInt(splitUserId) : null
      }

      try {
        const response = await dispatch(addAutoPayment(requestPayload))
        if (response) {
          dispatch(setMessage({ msg: response, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_AUTO_PAY);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  const handleEdit = async () => {
    setIsSubmitted(true);
    if (title && description && selectedType && amount && date && selectedCategory && userId && paymentId) {
      const requestPayload: RequestPayload = {
        title,
        description,
        type: selectedType,
        amount: parseInt(amount),
        date: parseInt(date),
        categoryId: parseInt(selectedCategory),
        userId: parseInt(userId),
        split,
        splitUserId: split === Split.true ? parseInt(splitUserId) : null
      }

      try {
        const response = await dispatch(editAutoPayment(parseInt(paymentId), requestPayload));
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_AUTO_PAY_EDIT_SUCCESS, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_AUTO_PAY);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Container className="padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">
        {paymentId ? 'Edit Auto Payment' : 'Add Auto Payment'}
      </Typography>
      <Grid container spacing={1}>
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
          <InputLabel className="input-label">Type</InputLabel>
          <FormControl fullWidth variant="outlined">
            <Select
              variant="outlined"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as Type)}
              renderValue={(val) => (val ? val : 'Select Type')}
              displayEmpty
              error={isSubmitted && !selectedType}
            >
              <MenuItem value={Type.EXPENSE}>{Type.EXPENSE}</MenuItem>
              <MenuItem value={Type.INCOME}>{Type.INCOME}</MenuItem>
            </Select>
            {
              isSubmitted && !selectedType &&
              <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>Select Type</FormHelperText>
            }
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
          <InputLabel className="input-label">Date</InputLabel>
          <FormControl fullWidth variant="outlined">
            <TextField
              type="text"
              variant="outlined"
              placeholder="Date"
              name="date"
              value={date}
              onChange={(e) => checkDate(e.target.value)}
              error={isSubmitted && !date}
              helperText={isSubmitted && !date && 'Enter Date'}
              inputProps={{
                maxLength: 2
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
        <Grid item xs={12}>
          <FormControl className="input-field">
            <FormControlLabel control={<Checkbox checked={split === Split.true} onChange={handleSplitChange} />} label="Split" />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel className="input-label">Split User</InputLabel>
          <FormControl fullWidth variant="outlined">
            <Select
              variant="outlined"
              value={split === Split.true ? splitUserId : ''}
              onChange={(e) => setSplitUserId(e.target.value)}
              disabled={split === Split.false}
              renderValue={(val) => {
                if (val === '') return 'Select Split User';
                const selected = splitUserList?.find((user) => user.id === parseInt(val));
                return selected ? `${selected.firstName} ${selected.lastName}` : 'Select Split User';
              }}
              displayEmpty
              error={split === Split.true && isSubmitted && !splitUserId}
            >
              {splitUserList?.map((user) => (
                <MenuItem value={user.id} key={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
            {split === Split.true && isSubmitted && !splitUserId && (
              <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>
                Select Split User
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" onClick={handleCancel}>Cancel</Button>
          {
            paymentId ?
              <Button variant="contained" onClick={handleEdit} disabled={disabled}>Edit Auto Pay</Button> :
              <Button variant="contained" onClick={handleSubmit} disabled={disabled}>Add Auto Pay</Button>
          }
        </Grid>
      </Grid>
    </Container>
  )
}

export default AddAutoPay;