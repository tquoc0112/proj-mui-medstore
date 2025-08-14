import { Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function AdminOrders() {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Typography>Orders page — wire up when order flows are ready.</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
