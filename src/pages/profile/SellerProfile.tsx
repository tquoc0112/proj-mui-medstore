import { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Paper,
  Avatar,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function SellerProfile() {
  const { cycle } = useContext(ThemeContext);

  // Example static; replace with /user/me
  const user = {
    email: "seller@example.com",
    profilePicUrl: "",
    role: "SALES",
    storeName: "MedStore Pharmacy",
    businessType: "Pharmacy / Drugstore",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Seller Profile
          </Typography>
          <IconButton onClick={cycle} aria-label="toggle theme" edge="end">
            <Brightness4Icon />
          </IconButton>
          <IconButton onClick={handleLogout} aria-label="logout" edge="end" sx={{ ml: 1 }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Paper className="fade-down" sx={{ p: 3, mx: "auto", maxWidth: 720 }}>
          <Stack alignItems="center" spacing={1.5}>
            <Avatar src={user.profilePicUrl} sx={{ width: 96, height: 96 }} />
            <Typography variant="h5">{user.storeName}</Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Business Type</Typography>
            <Typography variant="body1">{user.businessType}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
              <Button variant="contained">Edit store</Button>
              <Button variant="outlined">Upload logo</Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
