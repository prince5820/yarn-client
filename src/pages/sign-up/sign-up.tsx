import { Button, Checkbox, Container, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityOffIcon from '../../assets/icon/common/visibility-off.svg?react';
import VisibilityIcon from '../../assets/icon/common/visibility.svg?react';
import { CHECK_REGEX_EMAIL, CHECK_REGEX_MOBILE, PATH_TO_CHAT, PATH_TO_SIGN_IN } from "../../common/constants";
import { RequestPayload } from "./types";
import { useAppDispatch } from "../../store";
import { signUp } from "../../store/auth/thunk";
import { setMessage } from "../../store/snackbar/reducer";
import { MESSAGE_SIGN_UP_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";

const SignUp = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [check, setCheck] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const isFormValid = firstName && lastName && email && password && confirmPassword && gender && mobile && dob && address && check
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = localStorage.getItem('userId');

  useEffect(() => {
    if (user) {
      navigate(PATH_TO_CHAT);
    }
  }, [user]);

  useEffect(() => {
    if (isFormValid) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [isFormValid]);

  const validateEmail = (email: string) => {
    return CHECK_REGEX_EMAIL.test(email);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const checkMobile = (value: string) => {
    if (CHECK_REGEX_MOBILE.test(value)) {
      setMobile(value);
    }
  }

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (isFormValid && (password === confirmPassword) && mobile.length == 10) {
      const formattedDate = dayjs(dob).format('YYYY-MM-DD')

      const requestPayload: RequestPayload = {
        firstName,
        lastName,
        email,
        password,
        gender,
        mobile,
        dob: formattedDate,
        profileUrl: profileUrl || null,
        address
      }

      try {
        const response = await dispatch(signUp(requestPayload))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_SIGN_UP_SUCCESS, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_SIGN_IN);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Container className="wrapper-sign-up padding-wrapper-for-auth max-width-wrapper">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography className="sign-up-text mb-16">Sign up</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className="create-account-text">Create an account to get started</Typography>
        </Grid>
        <Grid item xs={6}>
          <InputLabel className="input-label">First Name</InputLabel>
          <FormControl fullWidth variant="outlined">
            <TextField
              type="text"
              variant="outlined"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={isSubmitted && !firstName}
              helperText={isSubmitted && !firstName && 'Enter First Name'}
              inputProps={{
                maxLength: 55
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <InputLabel className="input-label">Last Name</InputLabel>
          <FormControl fullWidth variant="outlined">
            <TextField
              type="text"
              variant="outlined"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={isSubmitted && !lastName}
              helperText={isSubmitted && !lastName && 'Enter Last Name'}
              inputProps={{
                maxLength: 55
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel className="input-label">Email Address</InputLabel>
          <FormControl fullWidth variant="outlined">
            <TextField
              type="text"
              variant="outlined"
              placeholder="name@email.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={(isSubmitted && !email) || (isSubmitted && !validateEmail(email))}
              helperText={(isSubmitted && !email && 'Enter Email') || (isSubmitted && !validateEmail(email) && 'Enter valid email')}
              inputProps={{
                maxLength: 55
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <InputLabel className="input-label" htmlFor="outlined-adornment-password">Password</InputLabel>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  {showPassword ? <VisibilityOffIcon className="svg-icon" onClick={handleClickShowPassword} style={{ cursor: 'pointer' }} /> : <VisibilityIcon className="svg-icon" onClick={handleClickShowPassword} style={{ cursor: 'pointer' }} />}
                </InputAdornment>
              }
              placeholder="Create a password"
              name="password"
              value={password}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onChange={(e) => setPassword(e.target.value)}
              error={isSubmitted && !password}
              inputProps={{
                maxLength: 55
              }}
            />
            <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !password && 'Enter Password'}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <InputLabel className="input-label" htmlFor="outlined-adornment-password" sx={{ visibility: 'hidden' }}>Confirm Password</InputLabel>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              id='outlined-adornment-confirm-password'
              type={showConfirmPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  {showConfirmPassword ? <VisibilityOffIcon className="svg-icon" onClick={handleClickShowConfirmPassword} style={{ cursor: 'pointer' }} /> : <VisibilityIcon className="svg-icon" onClick={handleClickShowConfirmPassword} style={{ cursor: 'pointer' }} />}
                </InputAdornment>
              }
              placeholder="Confirm password"
              name="confirmPassword"
              value={confirmPassword}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={isSubmitted && !confirmPassword}
              inputProps={{
                maxLength: 55
              }}
            />
            {
              isSubmitted && !confirmPassword ?
                <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !confirmPassword && 'Enter Confirm Password'}</FormHelperText> :
                <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && confirmPassword && password !== confirmPassword && 'Password and Confirm Password does not match'}</FormHelperText>
            }
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormLabel className="input-label">Gender</FormLabel>
          <RadioGroup sx={{ flexDirection: 'row' }} name='gender' value={gender} onChange={(e) => setGender(e.target.value)}>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
          <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !gender && 'Please Select Gender'}</FormHelperText>
        </Grid>
        <Grid item xs={6}>
          <InputLabel className="input-label">Mobile</InputLabel>
          <FormControl fullWidth variant="outlined">
            <TextField
              type="text"
              variant="outlined"
              placeholder="1234567890"
              name="mobile"
              value={mobile}
              onChange={(e) => checkMobile(e.target.value)}
              error={(isSubmitted && !mobile) || (isSubmitted && mobile.length < 10)}
              helperText={(isSubmitted && !mobile && 'Enter Mobile Number') || (isSubmitted && mobile.length < 10 && 'Mobile number must have 10 digits')}
              inputProps={{ maxLength: 10 }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <InputLabel className="input-label">DOB</InputLabel>
          <FormControl variant="outlined" fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dob"
                value={dob}
                onChange={(date) => setDob(date)}
              />
              {
                isSubmitted && !dob &&
                <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !dob && 'Enter DOB'}</FormHelperText>
              }
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel className="input-label">Profile Url (optional)</InputLabel>
          <FormControl fullWidth variant="outlined" style={{ marginBottom: 16 }}>
            <TextField
              type="text"
              variant="outlined"
              name="profileUrl"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              inputProps={{
                maxLength: 255
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel className="input-label">Address</InputLabel>
          <FormControl fullWidth variant="outlined">
            <TextField
              type="text"
              multiline
              rows={5}
              variant="outlined"
              placeholder="Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={isSubmitted && !address}
              helperText={isSubmitted && !address && 'Enter Address'}
              inputProps={{
                maxLength: 255
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl className='input-field'>
            <FormControlLabel control={<Checkbox checked={check} onChange={(e) => setCheck(e.target.checked)} />} label={
              <>
                I've read and agree with the
                <Link className="text-decoration-none" to='#'> Terms and Conditions </Link>
                and the
                <Link className="text-decoration-none" to='#'> Privacy Policy.</Link>
              </>
            } />
            <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !check && 'Please Confirm Terms and Conditions'}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button className="primary-button mb-16" variant="contained" color="primary" disabled={disabled} onClick={handleSubmit}>Sign up</Button>
          <div className='text-center'>
            <Typography variant='caption'>Already a member? <Link to={PATH_TO_SIGN_IN} className='text-decoration-none'>Sign in</Link></Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SignUp;