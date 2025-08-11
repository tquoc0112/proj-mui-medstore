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
  Button,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function CustomerProfile() {
  const { cycle } = useContext(ThemeContext);

  // Normally fetch user info with /user/me using the token.
  const user = {
    email: "customer@example.com",
    profilePicUrl: "",
    role: "CUSTOMER",
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
            Customer Profile
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
        <Paper className="fade-down" sx={{ p: 3, mx: "auto", maxWidth: 640 }}>
          <Stack alignItems="center" spacing={2}>
            <Avatar src={user.profilePicUrl} sx={{ width: 96, height: 96 }} />
            <Typography variant="h5">{user.email}</Typography>
            <Typography variant="body2">Role: {user.role}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained">Edit profile</Button>
              <Button variant="outlined">Change password</Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
