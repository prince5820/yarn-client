import { Snackbar, SnackbarContent } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../store";
import { clearMessage } from "../../../store/snackbar/reducer";

const SnackbarAlert = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { msg, className } = useSelector((state: RootState) => state.snackbarReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (msg) {
      setOpen(true);
    }
  }, [msg]);

  const handleClose = () => {
    setOpen(false);
    dispatch(clearMessage());
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <SnackbarContent
        message={msg}
        className={className}
      />
    </Snackbar>
  )
}

export default SnackbarAlert;