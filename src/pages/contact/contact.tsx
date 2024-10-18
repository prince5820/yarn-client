import { Container, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Plus from '../../assets/icon/common/plus.svg?react';
import { PATH_TO_ADD_CONTACT, PATH_TO_CONTACT_SUMMARY } from "../../common/constants";
import { SNACKBAR_ERROR } from "../../common/message";
import { useAppDispatch } from "../../store";
import { getContactByUserId } from "../../store/contact/thunk";
import { Contact as ContactResponse } from "../../store/contact/types";
import { setMessage } from "../../store/snackbar/reducer";

const Contact = () => {
  const [contactList, setContactList] = useState<ContactResponse[]>([]);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
    if (userId) {
      try {
        const response = await dispatch(getContactByUserId(userId))
        setContactList(response)
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  const goToAddContact = () => {
    navigate(PATH_TO_ADD_CONTACT);
  }

  const goToContactSummary = (contact: ContactResponse) => {
    navigate(PATH_TO_CONTACT_SUMMARY, { state: { contactDetail: contact } })
  }

  return (
    <Container className="wrapper-contact padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">Contact</Typography>
      <Grid container spacing={1} className="mb-16">
        <Grid item xs={11}>
          <Typography variant="body2" className="contact-text">Contact</Typography>
        </Grid>
        <Grid item xs={1}>
          <Plus className="svg-icon" onClick={goToAddContact} />
        </Grid>
      </Grid>
      <Divider className="mb-16" />
      {
        contactList.map((contact) => (
          <Grid container spacing={1} className="mb-4 mt-4" key={contact.id} sx={{ cursor: 'pointer' }} onClick={() => goToContactSummary(contact)}>
            <Grid item xs={2}>
              <img src={contact.profileUrl || "/src/assets/image/login.png"} className="circular-image" alt="contact-image" />
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">{contact.firstName} {contact.lastName}</Typography>
              <Typography variant="caption">{contact.email}</Typography>
            </Grid>
          </Grid>
        ))
      }
    </Container>
  )
}

export default Contact;