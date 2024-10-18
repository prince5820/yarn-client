import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { PATH_TO_CHAT, PATH_TO_SIGN_IN } from "../../common/constants";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store";
import { forgetPassword } from "../../store/auth/thunk";
import { setMessage } from "../../store/snackbar/reducer";
import { SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";

const ForgetPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const user = localStorage.getItem('userId');

  useEffect(() => {
    if (user) {
      navigate(PATH_TO_CHAT);
    }
  }, [user]);

  useEffect(() => {
    if (email) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email]);

  const handleForgetPassword = async () => {
    setIsSubmitted(true)
    if (email) {
      try {
        const response = await dispatch(forgetPassword(email))
        dispatch(setMessage({ msg: response, className: SNACKBAR_SUCCESS }))
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
            <Button className='primary-button mb-16' variant='contained' color='primary' onClick={handleForgetPassword} disabled={disabled}>Forget Password</Button>
            <Container className='text-center'>
              <Typography variant='caption'><Link to={PATH_TO_SIGN_IN} className='text-decoration-none'>Sign In</Link></Typography>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Container>
  )
}

export default ForgetPassword;