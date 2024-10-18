import { Button, Container, FormControl, FormHelperText, Grid, InputLabel, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_TO_PAYMENT } from "../../common/constants";
import { useAppDispatch } from "../../store";
import { analyzePayment, downloadPaymentPdf } from "../../store/payment/thunk";
import { Payment } from "../../store/payment/types";
import ReactECharts from 'echarts-for-react';
import { setMessage } from "../../store/snackbar/reducer";
import { SNACKBAR_ERROR } from "../../common/message";
import { downloadPdfDoc } from "../../common/utils/pdf-download";

const PaymentAnalyze = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [chartData, setChartData] = useState<Payment[]>([]);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (startDate || endDate) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [startDate, endDate]);

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
  }, [startDateError, endDateError, startDate, endDate]);

  const analyzeExpenseInChart = async () => {
    setIsSubmitted(true);

    if ((startDate || endDate) && !startDateError && !endDateError) {
      const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : null;
      const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : null;

      const requestPayload = {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }

      try {
        const response = await dispatch(analyzePayment(requestPayload));
        if (response) {
          setChartData(response);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  }

  const getChartOptions = () => {
    return {
      title: {
        text: 'Payment Analysis',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: 'Payments',
          type: 'pie',
          radius: ['20%', '70%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: chartData.map(payment => ({
            value: payment.amount,
            name: payment.title,
          })),
        },
      ],
    };
  };

  const handleDownloadPaymentPdf = async () => {
    setIsSubmitted(true);

    if ((startDate || endDate) && !startDateError && !endDateError && userId) {
      const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : null;
      const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : null;

      const requestPayload = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        userId
      }

      try {
        const response: any = await dispatch(downloadPaymentPdf(requestPayload));
        if (response) {
          downloadPdfDoc(response.data, response.name);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  }

  return (
    <>
      <Container className="wrapper-payment padding-wrapper-for-non-auth max-width-wrapper">
        <Typography variant="h6" className="text-center mb-16">Payment Analyzer</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <InputLabel className="input-label">Start Date</InputLabel>
            <FormControl fullWidth variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                {
                  isSubmitted && (!startDate && !endDate) &&
                  <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>Enter Start Date or End Date</FormHelperText>
                }
                {
                  isSubmitted && startDate && startDateError &&
                  <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{startDateError}</FormHelperText>
                }
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <InputLabel className="input-label">End Date</InputLabel>
            <FormControl fullWidth variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="date"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
                {
                  isSubmitted && endDate && endDateError &&
                  <FormHelperText sx={{ marginLeft: 0, color: '#d32f2f' }}>{endDateError}</FormHelperText>
                }
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={() => navigate(PATH_TO_PAYMENT)}>Cancel</Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={analyzeExpenseInChart} disabled={disabled}>Analyze in Chart</Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleDownloadPaymentPdf} disabled={disabled}>Download</Button>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: '20px' }}>
            {
              chartData.length > 0 && (
                <ReactECharts option={getChartOptions()} style={{ height: '400px', width: '100%' }} />
              )
            }
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default PaymentAnalyze;