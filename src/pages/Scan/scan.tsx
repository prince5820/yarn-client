import { Container, Typography } from "@mui/material";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_TO_SCANNED_SUMMARY } from "../../common/constants";

const Scan = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter((device) => device.kind === "videoinput");

        codeReader.decodeFromVideoDevice(
          videoInputDevices[0].deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const textResult = result.getText();
              const decodedRes = atob(textResult);
              const finalResult = JSON.parse(decodedRes);
              if (finalResult) {
                navigate(PATH_TO_SCANNED_SUMMARY, { state: { userDetail: finalResult } })
                codeReader.reset();
              }
            }

            if (err && !(err instanceof NotFoundException)) {
              console.error("QR code scan error:", err);
            }
          }
        );
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    if (videoRef.current && videoRef.current.paused) {
      startScanner();
    }

    return () => {
      codeReader.reset();
    };
  }, [navigate]);

  return (
    <Container className="padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h4">QR Code Scanner</Typography>
      <video
        ref={videoRef}
        className="mb-16"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <Typography variant="body2">Scan to send Money</Typography>
    </Container>
  )
}

export default Scan;