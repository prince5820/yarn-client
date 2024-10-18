import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import GreaterThan from '../../assets/icon/common/greater-than.svg?react';
import { PATH_TO_AUTO_PAY, PATH_TO_CATEGORIES, PATH_TO_CONTACT, PATH_TO_PAYMENT, PATH_TO_PROFILE, PATH_TO_ROOT_ROUTE, PATH_TO_SIGN_IN } from "../../common/constants";
import { SettingsMenuItem } from "./types";
import socket from "../../utils/web-socket-client";

const Settings = () => {
  const settingMenus = [
    { label: 'Profile', path: PATH_TO_PROFILE },
    { label: 'Categories', path: PATH_TO_CATEGORIES },
    { label: 'Payment', path: PATH_TO_PAYMENT },
    { label: 'Contact', path: PATH_TO_CONTACT },
    { label: 'Auto Pay', path: PATH_TO_AUTO_PAY },
    { label: 'Log out', path: PATH_TO_SIGN_IN },
  ]
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const goToPath = (path: string) => {
    if (path === PATH_TO_SIGN_IN || path === PATH_TO_ROOT_ROUTE) {
      localStorage.removeItem('userId');
      socket.emit('userLogout', userId);
    }

    navigate(path);
  }

  return (
    <Container className="padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">Setting</Typography>
      <Grid container spacing={2}>
        {
          settingMenus.map((menu: SettingsMenuItem) => (
            <React.Fragment key={menu.label}>
              <Grid item xs={11}>
                <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => goToPath(menu.path)}>{menu.label}</Typography>
              </Grid>
              <Grid item xs={1}>
                <GreaterThan className="greater-than-icon" />
              </Grid>
            </React.Fragment>
          ))
        }
      </Grid>
    </Container>
  )
}

export default Settings;