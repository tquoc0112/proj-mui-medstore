import Grid from "@mui/material/Grid";
import { Alert, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function SecurityForm({
  email,
  onResult,
}: {
  email: string;
  onResult: (ok: boolean, msg: string) => void;
}) {
  const [pwd, setPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChangePassword = async () => {
    if (!newPwd || newPwd !== confirm) {
      onResult(false, "Passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, password: pwd, newPassword: newPwd }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Change password failed");
      onResult(true, "Password changed.");
      setPwd(""); setNewPwd(""); setConfirm("");
    } catch (e: any) {
      onResult(false, e.message || "Change password failed");
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Change Password</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Current password"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="New password"
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Confirm new password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
            fullWidth
          />
        </Grid>
      </Grid>
      <Alert severity="info">Press Enter in “Confirm new password” to submit.</Alert>
    </Stack>
  );
}
