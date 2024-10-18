import { Container, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Container
      className="padding-wrapper-for-non-auth max-width-wrapper d-flex align-item-center justify-content-center"
      style={{ height: '100vh', flexDirection: 'column' }}
    >
      <Typography variant="h3" className="mb-16">404</Typography>
      <Typography variant="h5">Page Not found</Typography>
    </Container>
  )
}

export default NotFound;