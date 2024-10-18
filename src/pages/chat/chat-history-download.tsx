import { Button, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PdfDownloadPeriod } from "../../common/components/dialog/types";
import { PATH_TO_CHAT_SUMMARY, PATH_TO_ROOT_ROUTE } from "../../common/constants";
import { SNACKBAR_ERROR, SNACKBAR_SUCCESS } from "../../common/message";
import { downloadPdfDoc } from "../../common/utils/pdf-download";
import { useAppDispatch } from "../../store";
import { getPdfDoc, sentPdfInMail } from "../../store/chat/thunk";
import { PdfRequestPayload } from "../../store/chat/types";
import { setMessage } from "../../store/snackbar/reducer";

dayjs.extend(isoWeek);

const ChatHistoryDownload = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;

  useEffect(() => {
    if (!state) {
      navigate(PATH_TO_ROOT_ROUTE);
    }
  }, [state]);

  useEffect(() => {
    const today = dayjs().endOf('day'); // End of the current day

    // Validation for startDate
    if (startDate && startDate.isAfter(today)) {
      setStartDateError("Start date cannot be in the future.");
    } else if (endDate && startDate && startDate.isAfter(endDate)) {
      setStartDateError("Start date cannot be after the end date.");
    } else {
      setStartDateError(null);
    }

    // Validation for endDate
    if (endDate && endDate.isAfter(today)) {
      setEndDateError("End date cannot be in the future.");
    } else if (startDate && endDate && endDate.isBefore(startDate)) {
      setEndDateError("End date cannot be before the start date.");
    } else {
      setEndDateError(null);
    }

    if (selectedOption) {
      if (selectedOption === PdfDownloadPeriod.CUSTOM) {
        if (startDate && endDate) {
          setDisabled(false);
        } else {
          setDisabled(true);
        }

        return;
      }
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selectedOption, startDate, endDate, startDateError, endDateError]);

  const handleCancel = () => {
    navigate(PATH_TO_CHAT_SUMMARY, { state: { user: user } });
  }

  const handleDownload = async () => {
    setIsSubmitted(true);
    if (selectedOption && selectedOption !== 'Select Option') {
      const startTime = '00:00:00'
      const endTime = '23:59:59'

      const downloadPdf = async (requestPayload: PdfRequestPayload, pdfName: string) => {
        try {
          const response = await dispatch(getPdfDoc(requestPayload));

          if (response) {
            downloadPdfDoc(response, pdfName);
          }
        } catch (err) {
          if (typeof err === 'string') {
            dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
          } else {
            dispatch(setMessage({ msg: "An unexpected error occurred.", className: SNACKBAR_ERROR }));
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.CUSTOM) {
        if (startDate && endDate && userId && user && !startDateError && !endDateError) {
          const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
          const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

          const requestPayload = {
            startDate: `${formattedStartDate} ${startTime}`,
            endDate: `${formattedEndDate} ${endTime}`,
            senderId: parseInt(userId),
            user: user
          }

          const pdfName = `${user.firstName} ${user.lastName} - ${selectedOption} - ${formattedStartDate} - ${formattedEndDate}`;

          if (requestPayload) {
            downloadPdf(requestPayload, pdfName);
            return;
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.TODAY) {
        const todayDate = dayjs().format('YYYY-MM-DD');

        if (userId && user) {
          const requestPayload = {
            startDate: `${todayDate} ${startTime}`,
            endDate: `${todayDate} ${endTime}`,
            senderId: parseInt(userId),
            user: user,
            selectedOption
          };

          const pdfName = `${user.firstName} ${user.lastName} - ${selectedOption} - ${todayDate}`;

          if (requestPayload) {
            downloadPdf(requestPayload, pdfName);
            return;
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.WEEK) {
        const startOfWeek = dayjs().startOf('isoWeek').format('YYYY-MM-DD');
        const endOfWeek = dayjs().endOf('isoWeek').format('YYYY-MM-DD');

        if (userId && user) {
          const requestPayload = {
            startDate: `${startOfWeek} ${startTime}`,
            endDate: `${endOfWeek} ${endTime}`,
            senderId: parseInt(userId),
            user: user
          };

          const pdfName = `${user.firstName} ${user.lastName} - ${selectedOption} - ${startOfWeek} - ${endOfWeek}`;

          if (requestPayload) {
            downloadPdf(requestPayload, pdfName);
            return;
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.MONTH) {
        const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

        if (userId && user) {
          const requestPayload = {
            startDate: `${startOfMonth} ${startTime}`,
            endDate: `${endOfMonth} ${endTime}`,
            senderId: parseInt(userId),
            user: user
          };

          const pdfName = `${user.firstName} ${user.lastName} - ${selectedOption} - ${startOfMonth} - ${endOfMonth}`;

          if (requestPayload) {
            downloadPdf(requestPayload, pdfName);
            return;
          }
        }
      }
    }
  }

  const handleSentPdfInMail = () => {
    setIsSubmitted(true);
    if (selectedOption && selectedOption !== 'Select Option') {
      const startTime = '00:00:00'
      const endTime = '23:59:59'

      const sendPdfInMail = async (requestPayload: PdfRequestPayload) => {
        try {
          const response = await dispatch(sentPdfInMail(requestPayload));

          if (response) {
            dispatch(setMessage({ msg: response, className: SNACKBAR_SUCCESS }));
          }
        } catch (err) {
          if (typeof err === 'string') {
            dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
          } else {
            dispatch(setMessage({ msg: "An unexpected error occurred.", className: SNACKBAR_ERROR }));
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.CUSTOM) {
        if (startDate && endDate && userId && user && !startDateError && !endDateError) {
          const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
          const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

          const requestPayload = {
            startDate: `${formattedStartDate} ${startTime}`,
            endDate: `${formattedEndDate} ${endTime}`,
            senderId: parseInt(userId),
            user: user
          }

          if (requestPayload) {
            sendPdfInMail(requestPayload);
            return;
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.TODAY) {
        const todayDate = dayjs().format('YYYY-MM-DD');

        if (userId && user) {
          const requestPayload = {
            startDate: `${todayDate} ${startTime}`,
            endDate: `${todayDate} ${endTime}`,
            senderId: parseInt(userId),
            user: user,
            selectedOption
          };

          if (requestPayload) {
            sendPdfInMail(requestPayload);
            return;
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.WEEK) {
        const startOfWeek = dayjs().startOf('isoWeek').format('YYYY-MM-DD');
        const endOfWeek = dayjs().endOf('isoWeek').format('YYYY-MM-DD');

        if (userId && user) {
          const requestPayload = {
            startDate: `${startOfWeek} ${startTime}`,
            endDate: `${endOfWeek} ${endTime}`,
            senderId: parseInt(userId),
            user: user
          };

          if (requestPayload) {
            sendPdfInMail(requestPayload);
            return;
          }
        }
      }

      if (selectedOption === PdfDownloadPeriod.MONTH) {
        const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

        if (userId && user) {
          const requestPayload = {
            startDate: `${startOfMonth} ${startTime}`,
            endDate: `${endOfMonth} ${endTime}`,
            senderId: parseInt(userId),
            user: user
          };

          if (requestPayload) {
            sendPdfInMail(requestPayload);
            return;
          }
        }
      }
    }
  }

  return (
    user ? (
      <Container className="wrapper-payment-summary padding-wrapper-for-non-auth max-width-wrapper">
        <Typography variant="h6" className="text-center mb-16">Chat History</Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <InputLabel className="input-label">Download Period</InputLabel>
            <FormControl fullWidth variant="outlined">
              <Select
                variant="outlined"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value as PdfDownloadPeriod)}
                renderValue={(val) => (val ? val : 'Select Option')}
                displayEmpty
                error={isSubmitted && !selectedOption}
              >
                <MenuItem value={PdfDownloadPeriod.TODAY}>{PdfDownloadPeriod.TODAY}</MenuItem>
                <MenuItem value={PdfDownloadPeriod.WEEK}>{PdfDownloadPeriod.WEEK}</MenuItem>
                <MenuItem value={PdfDownloadPeriod.MONTH}>{PdfDownloadPeriod.MONTH}</MenuItem>
                <MenuItem value={PdfDownloadPeriod.CUSTOM}>{PdfDownloadPeriod.CUSTOM}</MenuItem>
              </Select>
              {
                isSubmitted && !selectedOption &&
                <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>Select Option</FormHelperText>
              }
            </FormControl>
          </Grid>
          {
            selectedOption === 'custom' && (
              <>
                <Grid item xs={12}>
                  <InputLabel className="input-label">Start Date</InputLabel>
                  <FormControl fullWidth variant="outlined">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        name="startDate"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                      {
                        isSubmitted && !startDate &&
                        <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>Enter Start Date</FormHelperText>
                      }
                      {
                        isSubmitted && startDate && startDateError &&
                        <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{startDateError}</FormHelperText>
                      }
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="input-label">End Date</InputLabel>
                  <FormControl fullWidth variant="outlined">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        name="endDate"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                      {
                        isSubmitted && !endDate &&
                        <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>Enter End Date</FormHelperText>
                      }
                      {
                        isSubmitted && endDate && endDateError &&
                        <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{endDateError}</FormHelperText>
                      }
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
              </>
            )
          }
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleCancel} fullWidth>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleDownload} disabled={disabled} fullWidth>
              Download
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSentPdfInMail} disabled={disabled} fullWidth>
              Send In Mail Attachment
            </Button>
          </Grid>
        </Grid>
      </Container>
    ) : (
      <></>
    )
  )
}

export default ChatHistoryDownload;