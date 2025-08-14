import { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";

const API = "http://localhost:5000";

type Overview = {
  usersCount: number;
  sellersPending: number;
  ordersCount: number;
  revenueTotal: number;
};

export default function AdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed");
        setData(body);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {[
        { label: "Users", value: data?.usersCount ?? 0 },
        { label: "Pending sellers", value: data?.sellersPending ?? 0 },
        { label: "Orders", value: data?.ordersCount ?? 0 },
        { label: "Revenue", value: `$${(data?.revenueTotal ?? 0).toLocaleString()}` },
      ].map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">{card.label}</Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>{card.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
