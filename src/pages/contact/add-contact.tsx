import { Button, Checkbox, Container, FormControl, FormControlLabel, Grid, InputLabel, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CHECK_REGEX_EMAIL, CHECK_REGEX_MOBILE, PATH_TO_ADD_CONTACT, PATH_TO_CONTACT, PATH_TO_EDIT_CONTACT } from "../../common/constants";
import { useAppDispatch } from "../../store";
import { createContact, editContact } from "../../store/contact/thunk";
import { useLocation, useNavigate } from "react-router-dom";
import { setMessage } from "../../store/snackbar/reducer";
import { MESSAGE_CONTACT_ADD_SUCCESS, MESSAGE_CONTACT_EDIT_SUCCESS, SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";
import { ActiveStatus, RequestPayload } from "../../store/contact/types";

const AddContact = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [active, setActive] = useState<ActiveStatus>(ActiveStatus.Inactive);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [initialProfileUrl, setInitialProfileUrl] = useState<string | null>(null);
  const [initialActive, setInitialActive] = useState<ActiveStatus>(ActiveStatus.Inactive);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const contactDetail = state?.contactDetail || null;

  const isAllFieldsValid = () => {
    return (
      firstName &&
      lastName &&
      mobile &&
      email &&
      mobile.length === 10 &&
      validateEmail(email)
    );
  };

  const isAnyFieldChanged = () => {
    return (
      firstName !== contactDetail?.firstName ||
      lastName !== contactDetail?.lastName ||
      mobile !== contactDetail?.mobile ||
      email !== contactDetail?.email ||
      profileUrl !== initialProfileUrl ||
      active !== initialActive
    );
  };

  useEffect(() => {
    if (pathname === PATH_TO_EDIT_CONTACT && contactDetail) {
      setFirstName(contactDetail.firstName);
      setLastName(contactDetail.lastName);
      setMobile(contactDetail.mobile);
      setEmail(contactDetail.email);
      setProfileUrl(contactDetail.profileUrl || '');
      setActive(contactDetail.active);

      setInitialProfileUrl(contactDetail.profileUrl || '');
      setInitialActive(contactDetail.active);
    } else if (pathname === PATH_TO_ADD_CONTACT) {
      resetForm();
    }
  }, [pathname, contactDetail]);

  useEffect(() => {
    if (pathname === PATH_TO_ADD_CONTACT || pathname === PATH_TO_EDIT_CONTACT) {
      setDisabled((!firstName && !lastName && !mobile && !email) || !isAnyFieldChanged());
    }
  }, [firstName, lastName, mobile, email, profileUrl, active]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setMobile('');
    setEmail('');
    setProfileUrl('');
    setActive(ActiveStatus.Inactive);
  };

  const validateEmail = (email: string) => CHECK_REGEX_EMAIL.test(email);

  const checkMobile = (value: string) => {
    if (CHECK_REGEX_MOBILE.test(value)) {
      setMobile(value);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const userId = localStorage.getItem('userId');
    if (isAllFieldsValid() && userId) {

      const requestPayload: RequestPayload = {
        firstName,
        lastName,
        mobile,
        email,
        profileUrl: profileUrl || null,
        active,
        userId: parseInt(userId),
      };

      try {
        const response = await dispatch(createContact(requestPayload));
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_CONTACT_ADD_SUCCESS, className: SNACKBAR_SUCCESS }));
          navigate(PATH_TO_CONTACT);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  };

  const handleEdit = async () => {
    setIsSubmitted(true);
    if (isAllFieldsValid() && contactDetail) {

      const requestPayload = {
        firstName,
        lastName,
        mobile,
        email,
        profileUrl: profileUrl || null,
        active
      };

      try {
        const response = await dispatch(editContact(contactDetail.id, requestPayload));
        if (response) {
          dispatch(setMessage({ msg: MESSAGE_CONTACT_EDIT_SUCCESS, className: SNACKBAR_SUCCESS }));
          navigate(PATH_TO_CONTACT);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(e.target.checked ? ActiveStatus.Active : ActiveStatus.Inactive);
  }

  return (
    <Container className="padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">
        {pathname === PATH_TO_ADD_CONTACT ? 'Add Contact' : 'Edit Contact'}
      </Typography>
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
              inputProps={{ maxLength: 55 }}
              disabled={pathname === PATH_TO_EDIT_CONTACT}
            />
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
          <FormControl className="input-field">
            <FormControlLabel control={<Checkbox checked={active === ActiveStatus.Active} onChange={handleActiveChange} />} label="Active" />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          {pathname === PATH_TO_ADD_CONTACT ? (
            <Button variant="contained" className="primary-button" disabled={disabled} onClick={handleSubmit}>
              Add Contact
            </Button>
          ) : (
            <Button variant="contained" className="primary-button" disabled={disabled} onClick={handleEdit}>
              Edit Contact
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddContact;
