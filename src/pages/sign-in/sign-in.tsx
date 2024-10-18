import { Button, Container, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityOffIcon from '../../assets/icon/common/visibility-off.svg?react';
import VisibilityIcon from '../../assets/icon/common/visibility.svg?react';
import { PATH_TO_CHAT, PATH_TO_FORGET_PASSWORD, PATH_TO_SIGN_UP } from "../../common/constants";
import { MESSAGE_SIGN_IN_EMAIL_PASSWORD_NOT_MATCH, MESSAGE_SIGN_IN_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";
import { useAppDispatch } from "../../store";
import { signIn } from "../../store/auth/thunk";
import { setMessage } from "../../store/snackbar/reducer";

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = localStorage.getItem('userId');

  useEffect(() => {
    if (user) {
      navigate(PATH_TO_CHAT);
    }
  }, [user]);

  useEffect(() => {
    if (email && password) {
      setDisabled(false)
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (email && password) {
      try {
        const response = await dispatch(signIn(email));
        const user = response[0];
        if (user.email === email && user.password === password) {
          dispatch(setMessage({ msg: MESSAGE_SIGN_IN_SUCCESS, className: SNACKBAR_SUCCESS }))
          localStorage.setItem('userId', user.id);
          navigate(PATH_TO_CHAT);
        } else {
          dispatch(setMessage({ msg: MESSAGE_SIGN_IN_EMAIL_PASSWORD_NOT_MATCH, className: SNACKBAR_ERROR }))
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Container className="wrapper-sign-in padding-none">
      <Container className="image-section max-width-wrapper">
        <img className="login-image" src="/src/assets/image/login.png" alt="login image" />
      </Container>
      <Container className="padding-wrapper-for-auth max-width-wrapper">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography className="welcome-text">Welcome!</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={isSubmitted && !email}
              helperText={isSubmitted && !email && 'Enter Email'}
              inputProps={{
                maxLength: 55
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id='outlined-adornment-password'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    {showPassword ? <VisibilityOffIcon className="svg-icon" onClick={handleClickShowPassword} style={{ cursor: 'pointer' }} /> : <VisibilityIcon className="svg-icon" onClick={handleClickShowPassword} style={{ cursor: 'pointer' }} />}
                  </InputAdornment>
                }
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={isSubmitted && !password}
                inputProps={{
                  maxLength: 55
                }}
              />
              <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !password && 'Enter Password'}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button className='primary-button mb-16' variant='contained' color='primary' onClick={handleSubmit} disabled={disabled}>Login</Button>
            <div className='text-center mb-16'>
              <Typography variant='caption'>Not a member? <Link to={PATH_TO_SIGN_UP} className='text-decoration-none'>Register Now</Link></Typography>
            </div>
            <div className='text-center'>
              <Typography variant='caption'><Link to={PATH_TO_FORGET_PASSWORD} className='text-decoration-none'>Forget Password?</Link></Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Container>
  )
}

export default SignIn;