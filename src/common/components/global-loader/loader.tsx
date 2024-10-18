import { Backdrop, Box, CircularProgress } from "@mui/material";
import { GlobalLoaderConfig } from "./global-loader";

function Loader() {
  const [loading] = GlobalLoaderConfig();
  return (
    <>
      <Box>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress />
        </Backdrop>
      </Box>
    </>
  );
}

export default Loader;