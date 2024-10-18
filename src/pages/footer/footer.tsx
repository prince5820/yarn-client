import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Chat from '../../assets/icon/footer/chat.svg?react';
import Favourite from '../../assets/icon/footer/favourite.svg?react';
import Profile from '../../assets/icon/footer/profile.svg?react';
import Recent from '../../assets/icon/footer/recent.svg?react';
import Setting from '../../assets/icon/footer/setting.svg?react';
import Scan from '../../assets/icon/footer/scan.svg?react';
import { PATH_TO_CHAT, PATH_TO_FORGET_PASSWORD, PATH_TO_PROFILE, PATH_TO_ROOT_ROUTE, PATH_TO_SCAN, PATH_TO_SETTINGS, PATH_TO_SIGN_IN, PATH_TO_SIGN_UP } from "../../common/constants";
import { RootState, useAppDispatch } from "../../store";
import { setActiveMenu } from "../../store/footer/reducer";
import { useEffect } from "react";

const Footer = () => {
  const footerMenu = [
    { label: 'Profile', icon: Profile, path: PATH_TO_PROFILE },
    { label: 'Chat', icon: Chat, path: PATH_TO_CHAT },
    { label: 'Scan', icon: Scan, path: PATH_TO_SCAN },
    { label: 'Favourites', icon: Favourite, path: '#' },
    { label: 'Recent', icon: Recent, path: '#' },
    { label: 'Settings', icon: Setting, path: PATH_TO_SETTINGS },
  ]
  const dispatch = useAppDispatch();
  const { activeMenu } = useSelector((state: RootState) => state.footerReducer);
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const currentMenuItem = footerMenu.find(menuItem => menuItem.path === pathName);

    if (currentMenuItem) {
      dispatch(setActiveMenu(currentMenuItem.label));
    }
  }, [dispatch, pathName, footerMenu]);

  const handleChange = (_event: any, newValue: string) => {
    dispatch(setActiveMenu(newValue));
  };

  const navigateTo = (path: string) => {
    navigate(path);
  }

  return (
    <>
      {
        pathName !== PATH_TO_SIGN_IN && pathName !== PATH_TO_ROOT_ROUTE && pathName !== PATH_TO_SIGN_UP && pathName !== PATH_TO_FORGET_PASSWORD &&
        <Paper className="wrapper-footer" elevation={0}>
          <BottomNavigation
            showLabels
            className="footer-menu-section"
            value={activeMenu}
            onChange={handleChange}
            sx={{ maxWidth: 500, width: '100%' }}
          >
            {
              footerMenu.map((menuItem) => (
                <BottomNavigationAction
                  key={menuItem.label}
                  className="min-width-60"
                  label={menuItem.label}
                  icon={<menuItem.icon className={`svg-icon mb-8 ${activeMenu === menuItem.label ? 'active-menu' : ''}`} />}
                  value={menuItem.label}
                  onClick={() => navigateTo(menuItem.path)}
                />
              ))
            }
          </BottomNavigation>
        </Paper>
      }
    </>
  )
}

export default Footer;