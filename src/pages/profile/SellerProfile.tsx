import { useEffect, useMemo, useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Container, Paper,
  Avatar, Button, Stack, TextField, Divider, Snackbar, Alert
} from "@mui/material";
import Grid from "@mui/material/Grid";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import type { Address, SellerProfile as Profile } from "../../types/profile";

const API = "http://localhost:5000";

export default function SellerProfile() {
  const [me, setMe] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [snack, setSnack] = useState<{open:boolean; msg:string; sev:"success"|"error"|"info"}>({open:false,msg:"",sev:"success"});
  const [pwd, setPwd] = useState({ current:"", next:"", confirm:"" });
  const token = useMemo(() => localStorage.getItem("token") || "", []);

  const logout = () => { localStorage.removeItem("token"); window.location.href = "/"; };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = JSON.parse(await res.text());
        setMe(data.profile);
        setDraft(data.profile);
      } catch {
        setSnack({ open:true, msg:"Failed to load profile", sev:"error" });
      }
    })();
  }, [token]);

  const setField = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setDraft((d) => d ? ({ ...d, [k]: v }) as Profile : d);

  const setAddress = (patch: Partial<Address>) =>
    setDraft((d) => d ? ({ ...d, address: { ...(d.address || {}), ...patch } } as Profile) : d);

  const uploadAvatar = async (file: File) => {
    const form = new FormData(); form.append("avatar", file);
    try {
      const res = await fetch(`${API}/api/user/avatar`, { method:"POST", headers:{ Authorization:`Bearer ${token}` }, body: form });
      const body = JSON.parse(await res.text());
      if (!res.ok) throw new Error(body.error || "Upload failed");
      setField("avatarUrl", body.url || body.avatarUrl);
      setSnack({ open:true, msg:"Avatar updated", sev:"success" });
    } catch (e:any) {
      setSnack({ open:true, msg:e.message, sev:"error" });
    }
  };

  const saveAll = async () => {
    if (!draft) return;
    try {
      const res = await fetch(`${API}/api/user/me`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft),
      });
      const txt = await res.text(); let body:any={}; try{ body = txt?JSON.parse(txt):{};}catch{}
      if (!res.ok) throw new Error(body.error || `Update failed (${res.status})`);
      setMe(draft);
      setSnack({ open:true, msg:"Seller profile saved", sev:"success" });
    } catch (e:any) {
      setSnack({ open:true, msg:e.message || "Save failed", sev:"error" });
    }
  };

  const changePassword = async () => {
    if (!pwd.current || !pwd.next || pwd.next !== pwd.confirm) {
      setSnack({ open:true, msg:"Check password fields", sev:"error" });
      return;
    }
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: draft?.email, password: pwd.current, newPassword: pwd.next }),
      });
      const txt = await res.text(); let body:any={}; try{ body = txt?JSON.parse(txt):{};}catch{}
      if (!res.ok) throw new Error(body.error || `Change password failed (${res.status})`);
      setPwd({ current:"", next:"", confirm:"" });
      setSnack({ open:true, msg:"Password changed", sev:"success" });
    } catch (e:any) {
      setSnack({ open:true, msg:e.message || "Change password failed", sev:"error" });
    }
  };

  if (!draft) return null;

  return (
    <>
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Seller Profile</Typography>
          <IconButton onClick={logout} aria-label="logout"><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid>
            <Avatar src={draft.avatarUrl || undefined} sx={{ width: 72, height: 72 }}>
              {draft.firstName?.[0] || draft.email[0]?.toUpperCase()}
            </Avatar>
          </Grid>
          <Grid size="grow">
            <Typography variant="h6">
              {`${draft.firstName || ""} ${draft.lastName || ""}`.trim() || "Unnamed"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {draft.role} — {draft.id}
            </Typography>
          </Grid>
          <Grid>
            <input
              id="pick-avatar-seller"
              type="file"
              accept="image/*"
              hidden
              onChange={(e)=>{ const f=e.target.files?.[0]; if (f) uploadAvatar(f); }}
            />
            <label htmlFor="pick-avatar-seller">
              <Button variant="outlined" startIcon={<PhotoCamera />} component="span">
                Change photo
              </Button>
            </label>
          </Grid>

          {/* Store info */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Store
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Store name" fullWidth
                    value={draft.storeName || ""}
                    onChange={(e)=>setField("storeName", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Business type" fullWidth
                    value={draft.businessType || ""}
                    onChange={(e)=>setField("businessType", e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Contact
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="First name" fullWidth
                    value={draft.firstName || ""}
                    onChange={(e)=>setField("firstName", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Last name" fullWidth
                    value={draft.lastName || ""}
                    onChange={(e)=>setField("lastName", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="Email" fullWidth value={draft.email} disabled />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Phone" fullWidth
                    value={draft.phone || ""}
                    onChange={(e)=>setField("phone", e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Address
              </Typography>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    label="Address line 1" fullWidth
                    value={draft.address?.line1 || ""}
                    onChange={(e)=>setAddress({ line1: e.target.value })}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Address line 2" fullWidth
                    value={draft.address?.line2 || ""}
                    onChange={(e)=>setAddress({ line2: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    label="City" fullWidth
                    value={draft.address?.city || ""}
                    onChange={(e)=>setAddress({ city: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="ZIP/Postal" fullWidth
                    value={draft.address?.zip || ""}
                    onChange={(e)=>setAddress({ zip: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Country" fullWidth
                    value={draft.address?.country || ""}
                    onChange={(e)=>setAddress({ country: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Security */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Security
              </Typography>
              <Stack spacing={2}>
                <TextField
                  type="password" label="Current password"
                  value={pwd.current} onChange={(e)=>setPwd({...pwd, current:e.target.value})}
                />
                <TextField
                  type="password" label="New password"
                  value={pwd.next} onChange={(e)=>setPwd({...pwd, next:e.target.value})}
                />
                <TextField
                  type="password" label="Confirm new password"
                  value={pwd.confirm}
                  onChange={(e)=>setPwd({...pwd, confirm:e.target.value})}
                  onKeyDown={(e)=> e.key==="Enter" && changePassword()}
                />
                <Button variant="outlined" onClick={changePassword}>Change password</Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Footer actions */}
          <Grid size={12} sx={{ display:"flex", gap:2, justifyContent:"flex-end" }}>
            <Button onClick={()=>setDraft(me!)}>Reset</Button>
            <Button variant="contained" onClick={saveAll}>Save changes</Button>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snack.open}
        onClose={()=>setSnack(s=>({...s,open:false}))}
        autoHideDuration={3000}
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
      >
        <Alert severity={snack.sev} onClose={()=>setSnack(s=>({...s,open:false}))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
