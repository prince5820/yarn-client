import { Button, Container, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";
import { CHECK_REGEX_EMAIL, CHECK_REGEX_MOBILE, PATH_TO_CHAT } from "../../common/constants";
import { MESSAGE_USER_UPDATE_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";
import { useAppDispatch } from "../../store";
import { getUserById, updateUser } from "../../store/profile/thunk";
import { setMessage } from "../../store/snackbar/reducer";
import { useNavigate } from "react-router-dom";
import { User } from "../../store/auth/types";
import QRCode from "react-qr-code";

dayjs.extend(utc);
dayjs.extend(timezone);

const Profile = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [userByIdResponse, setUserByIdResponse] = useState<User | null>(null);
  const [qrEncodedData, setQrEncodedData] = useState<any>(null);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const checkValueChanges = () => {
    return (
      firstName &&
      lastName &&
      email &&
      gender &&
      mobile &&
      dob &&
      address &&
      userByIdResponse &&
      (
        userByIdResponse?.firstName !== firstName ||
        userByIdResponse?.lastName !== lastName ||
        userByIdResponse?.email !== email ||
        userByIdResponse?.gender !== gender ||
        userByIdResponse?.mobile !== mobile ||
        userByIdResponse?.dob !== dob?.toISOString() ||
        userByIdResponse?.profileUrl !== profileUrl ||
        userByIdResponse?.address !== address
      )
    );
  };

  useEffect(() => {
    setDisabled(!checkValueChanges());
  }, [
    firstName,
    lastName,
    email,
    gender,
    mobile,
    dob,
    address,
    profileUrl,
    userByIdResponse
  ]);



  useEffect(() => {
    userById();
  }, [userId]);

  const userById = async () => {
    if (userId) {
      try {
        const response = await dispatch(getUserById(userId))
        const user = response[0];
        setUserByIdResponse(user);
        const jsonString = JSON.stringify(user);
        const encodedUserData = btoa(jsonString);
        setQrEncodedData(encodedUserData);
        const formattedDate = dayjs.utc(user.dob).local();
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        setGender(user.gender || '');
        setMobile(user.mobile || '');
        setDob(formattedDate);
        setProfileUrl(user.profileUrl || '');
        setAddress(user.address || '');
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  const validateEmail = (email: string) => {
    return CHECK_REGEX_EMAIL.test(email);
  };

  const checkMobile = (value: string) => {
    if (CHECK_REGEX_MOBILE.test(value)) {
      setMobile(value);
    }
  }

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (firstName && lastName && email && gender && mobile && dob && address && userId) {
      const formattedDate = dayjs(dob).format('YYYY-MM-DD');
      const requestPayload = {
        firstName,
        lastName,
        email,
        gender,
        mobile,
        dob: formattedDate,
        profileUrl: profileUrl || null,
        address
      }
      try {
        const response = await dispatch(updateUser(userId, requestPayload))
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_USER_UPDATE_SUCCESS, className: SNACKBAR_SUCCESS }))
          navigate(PATH_TO_CHAT);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  return (
    <Container className="wrapper-profile padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">Profile</Typography>
      <Container className="text-center mb-16">
        <img className="profile-image" src={userByIdResponse?.profileUrl || '/src/assets/image/login.png'} alt="Profile image" />
      </Container>
      <Typography className="text-center username">{userByIdResponse?.firstName} {userByIdResponse?.lastName}</Typography>
      <Typography className="text-center mb-16 user-email">{userByIdResponse?.email}</Typography>
      {
        qrEncodedData && (
          <Grid container spacing={1} className="mb-16">
            <Grid item xs={12}>
              <QRCode
                value={qrEncodedData}
                size={200}
                style={{ maxWidth: "100%", width: "100%" }}
              />
            </Grid>
          </Grid>
        )
      }
      <Grid container spacing={1}>
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
              inputProps={{ maxLength: 55 }}
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
              inputProps={{ maxLength: 55 }}
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
              disabled
              onChange={(e) => setEmail(e.target.value)}
              error={(isSubmitted && !email) || (isSubmitted && !validateEmail(email))}
              helperText={(isSubmitted && !email && 'Enter Email') || (isSubmitted && !validateEmail(email) && 'Enter valid email')}
              inputProps={{ maxLength: 55 }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel className="input-label">Gender</FormLabel>
            <RadioGroup sx={{ flexDirection: 'row' }} name='gender' value={gender} onChange={(e) => setGender(e.target.value)}>
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
            {
              isSubmitted && !gender &&
              <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !gender && 'Please Select Gender'}</FormHelperText>
            }
          </FormControl>
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
          <FormControl fullWidth variant="outlined">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dob"
                value={dob}
                onChange={(date) => setDob(date)}
              />
              <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{isSubmitted && !dob && 'Enter DOB'}</FormHelperText>
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel className="input-label">Profile Url (optional)</InputLabel>
          <FormControl fullWidth variant="outlined">
            <TextField
              type="text"
              variant="outlined"
              name="profileUrl"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              inputProps={{ maxLength: 255 }}
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
              inputProps={{ maxLength: 255 }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button className="primary-button mb-16" variant="contained" color="primary" disabled={disabled} onClick={handleSubmit}>Update Profile</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile;