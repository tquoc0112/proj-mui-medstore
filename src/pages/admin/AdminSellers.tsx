import { useEffect, useState } from "react";
import { Paper, Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

const API = "http://localhost:5000";

type SellerRow = {
  id: number;
  email: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  storeName: string | null;
  businessType: string | null;
  sellerId: string | null;
  createdAt: string;
};

export default function AdminSellers() {
  const token = localStorage.getItem("token") || "";
  const [rows, setRows] = useState<SellerRow[]>([]);

  const load = async () => {
    const res = await fetch(`${API}/api/admin/sellers?status=PENDING`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    if (res.ok) setRows(body.rows || []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const decide = async (id: number, action: "approve" | "reject") => {
    const res = await fetch(`${API}/api/admin/sellers/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    });
    if (res.ok) load();
  };

  return (
    <Grid container spacing={2}>
      {rows.map((s) => (
        <Grid key={s.id} size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Typography fontWeight={700}>{s.storeName || "(No store name)"}</Typography>
              <Typography variant="body2" color="text.secondary">{s.email}</Typography>
              <Typography variant="body2" color="text.secondary">{s.businessType || "—"}</Typography>
            </div>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={() => decide(s.id, "approve")}>Approve</Button>
              <Button size="small" color="warning" onClick={() => decide(s.id, "reject")}>Reject</Button>
            </Stack>
          </Paper>
        </Grid>
      ))}
      {rows.length === 0 && (
        <Grid size={12}><Typography color="text.secondary">No pending sellers.</Typography></Grid>
      )}
    </Grid>
  );
}
