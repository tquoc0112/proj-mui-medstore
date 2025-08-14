import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, Divider, Tooltip, CssBaseline
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Storefront";
import ReceiptIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

export default function AdminLayout() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const items = useMemo(
    () => [
      { key: "/admin", label: "Overview", icon: <DashboardIcon /> },
      { key: "/admin/users", label: "Users", icon: <PeopleIcon /> },
      { key: "/admin/sellers", label: "Sellers", icon: <StoreIcon /> },
      { key: "/admin/orders", label: "Orders", icon: <ReceiptIcon /> },
    ],
    []
  );

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); nav("/", { replace: true }); };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" color="default" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Admin Dashboard</Typography>
          <Tooltip title="Logout"><IconButton onClick={logout}><LogoutIcon /></IconButton></Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
        open
      >
        <Toolbar />
        <Divider />
        <List>
          {items.map((it) => (
            <ListItemButton key={it.key} selected={pathname === it.key} onClick={() => nav(it.key)}>
              <ListItemIcon>{it.icon}</ListItemIcon>
              <ListItemText primary={it.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        <Grid container spacing={2}>
          <Grid>
            {/* The Outlet renders the admin child page */}
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
