import { Button, Container, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ACTIVE, INACTIVE, PATH_TO_CONTACT, PATH_TO_EDIT_CONTACT, PATH_TO_ROOT_ROUTE } from "../../common/constants";
import { useEffect, useState } from "react";
import DeleteContactDialog from "../../common/components/dialog/delete-contact-dialog";
import { ActiveStatus } from "../../store/contact/types";

const ContactSummary = () => {
  const { state } = useLocation();
  const { contactDetail } = state;
  const activeValue = contactDetail.active === ActiveStatus.Inactive ? INACTIVE : ACTIVE
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    if (!state) {
      navigate(PATH_TO_ROOT_ROUTE);
    }
  }, [state]);

  const goToContactPage = () => {
    navigate(PATH_TO_CONTACT);
  }

  const handleEditContact = () => {
    navigate(PATH_TO_EDIT_CONTACT, { state: { contactDetail: contactDetail } })
  }

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  }

  return (
    contactDetail ? (
      <>
        <Container className="wrapper-contact-summary padding-wrapper-for-non-auth max-width-wrapper">
          <Typography variant="h6" className="text-center mb-16">Contact Summary</Typography>
          {
            contactDetail.profileUrl &&
            <Container className="text-center mb-16">
              <img className="profile-image" src={contactDetail.profileUrl} alt="Profile image" />
            </Container>
          }
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <Typography className="payment-detail-title">First Name</Typography>
              <Typography variant="body2">{contactDetail.firstName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className="payment-detail-title">Last Name</Typography>
              <Typography variant="body2">{contactDetail.lastName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className="payment-detail-title">Active</Typography>
              <Typography variant="body2">{activeValue}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className="payment-detail-title">Mobile</Typography>
              <Typography variant="body2">{contactDetail.mobile}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className="payment-detail-title">Email</Typography>
              <Typography variant="body2">{contactDetail.email}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="contained" onClick={goToContactPage}>Back</Button>
              <Button variant="contained" onClick={handleEditContact}>Edit</Button>
              <Button variant="contained" onClick={handleDelete}>Delete</Button>
            </Grid>
          </Grid>
        </Container>
        <DeleteContactDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          contactDetail={contactDetail}
        />
      </>
    ) : (
      <></>
    )
  )
}

export default ContactSummary;