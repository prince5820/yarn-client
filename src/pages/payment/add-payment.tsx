import { Button, Checkbox, Container, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { CHECK_REGEX_AMOUNT, PATH_TO_ADD_PAYMENT, PATH_TO_EDIT_PAYMENT, PATH_TO_PAYMENT } from "../../common/constants";
import { MESSAGE_PAYMENT_ADD_SUCCESS, MESSAGE_PAYMENT_EDIT_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";
import { useAppDispatch } from "../../store";
import { getCategories } from "../../store/category/thunk";
import { Category } from "../../store/category/types";
import { setMessage } from "../../store/snackbar/reducer";
import { useLocation, useNavigate } from "react-router-dom";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { RequestPayload, Split, Type } from "../../store/payment/types";
import { addPayment, editPayment } from "../../store/payment/thunk";
import { getUsersList } from "../../store/chat/thunk";
import { User } from "../../store/auth/types";

dayjs.extend(utc);
dayjs.extend(timezone);

const AddPayment = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedType, setSelectedType] = useState<Type | ''>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[] | null>(null);
  const [split, setSplit] = useState<Split>(Split.false);
  const [splitUserId, setSplitUserId] = useState<string>('');
  const [splitUserList, setSplitUserList] = useState<User[] | null>(null);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const paymentDetail = state?.paymentDetail || null;

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
    const today = dayjs().endOf('day');

    if (date && date.isAfter(today)) {
      setDateError('Date cannot be in the future');
    } else {
      setDateError(null);
    }
  }, [date, dateError]);

  useEffect(() => {
    if (pathname === PATH_TO_EDIT_PAYMENT && paymentDetail && categoryList) {
      const formattedDate = dayjs(paymentDetail.date).local();
      setTitle(paymentDetail.title)
      setDescription(paymentDetail.description)
      setSelectedType(paymentDetail.type);
      setAmount(paymentDetail.amount)
      setDate(formattedDate);
      setSelectedCategory(paymentDetail.categoryId);
      setSplit(paymentDetail.split);
      setSplitUserId(paymentDetail.splitUserId);
    } else if (pathname === PATH_TO_ADD_PAYMENT) {
      setTitle('')
      setDescription('')
      setSelectedType('')
      setAmount('')
      setDate(null);
      setSelectedCategory('')
      setSplit(Split.false);
      setSplitUserId('');
    }
  }, [pathname, paymentDetail, categoryList]);

  useEffect(() => {
    if (pathname === PATH_TO_ADD_PAYMENT) {
      if (title && description && selectedType && amount && date && selectedCategory) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }

    if (pathname === PATH_TO_EDIT_PAYMENT && paymentDetail) {
      if (
        (title &&
          description &&
          selectedType &&
          amount &&
          date &&
          selectedCategory) &&
        (title !== paymentDetail.title ||
          description !== paymentDetail.description ||
          selectedType !== paymentDetail.type ||
          parseInt(amount) !== paymentDetail.amount ||
          date?.format('YYYY-MM-DD') !== dayjs(paymentDetail.date).format('YYYY-MM-DD') ||
          selectedCategory !== paymentDetail.categoryId)) {
        setDisabled(false)
      } else {
        setDisabled(true);
      }
    }

  }, [title, description, selectedType, amount, date, selectedCategory, pathname, paymentDetail, disabled]);

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
    if (split === Split.false) {
      setSplitUserId('');
    }
  }, [split]);

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

  const handleCancel = () => {
    navigate(PATH_TO_PAYMENT);
  }

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (title && description && selectedType && amount && date && selectedCategory && userId && !dateError) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const requestPayload: RequestPayload = {
        title,
        description,
        type: selectedType,
        amount: parseInt(amount),
        date: formattedDate,
        categoryId: parseInt(selectedCategory),
        userId: parseInt(userId),
        split,
        splitUserId: split === Split.true ? parseInt(splitUserId) : null
      }

      try {
        const response = await dispatch(addPayment(requestPayload))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_PAYMENT_ADD_SUCCESS, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_PAYMENT);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  const handleEdit = async () => {
    setIsSubmitted(true);
    const paymentId = paymentDetail.id;

    if (title && description && selectedType && amount && date && selectedCategory && userId && paymentId && !dateError) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const requestPayload: RequestPayload = {
        title,
        description,
        type: selectedType,
        amount: parseInt(amount),
        date: formattedDate,
        categoryId: parseInt(selectedCategory),
        userId: parseInt(userId),
        split,
        splitUserId: split === Split.true ? parseInt(splitUserId) : null
      }

      try {
        const response = await dispatch(editPayment(paymentId, requestPayload))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_PAYMENT_EDIT_SUCCESS, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_PAYMENT);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  const handleSplitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSplit(e.target.checked ? Split.true : Split.false);
  }

  return (
    <Container className="padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">
        {pathname === PATH_TO_ADD_PAYMENT ? 'Add Payment' : 'Edit Payment'}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="date"
                value={date}
                onChange={(date) => setDate(date)}
              />
              {
                isSubmitted && !date &&
                <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>Enter Date</FormHelperText>
              }
              {
                isSubmitted && date && dateError &&
                <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{dateError}</FormHelperText>
              }
            </LocalizationProvider>
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
            pathname === PATH_TO_ADD_PAYMENT ?
              <Button variant="contained" onClick={handleSubmit} disabled={disabled}>Add</Button> :
              <Button variant="contained" onClick={handleEdit} disabled={disabled}>Edit</Button>
          }
        </Grid>
      </Grid>
    </Container>
  )
}

export default AddPayment;