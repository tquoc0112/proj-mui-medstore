import Grid from "@mui/material/Grid"; // Grid v2 (no `item`, use `size`) :contentReference[oaicite:2]{index=2}
import { Avatar, Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import type { ProfileDraft } from "../../types/profile";

export default function AccountForm({
  draft,
  setField,
  sellerExtras,
}: {
  draft: ProfileDraft;
  setField: <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => void;
  sellerExtras?: {
    storeName: string;
    businessType: string;
    onChange: (patch: Partial<{ storeName: string; businessType: string }>) => void;
  };
}) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box position="relative">
          <Avatar sx={{ width: 84, height: 84, fontSize: 32 }} src={draft.avatarUrl || undefined}>
            {(draft.firstName || "U")[0]}
          </Avatar>
          <IconButton size="small" sx={{ position: "absolute", bottom: 0, right: 0 }} aria-label="upload avatar">
            <UploadIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{draft.firstName} {draft.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">ID: {draft.id}</Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="First name" value={draft.firstName || ""} onChange={(e) => setField("firstName", e.target.value)} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Last name" value={draft.lastName || ""} onChange={(e) => setField("lastName", e.target.value)} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Email" value={draft.email} disabled fullWidth helperText="Email cannot be changed." />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Phone" value={draft.phone || ""} onChange={(e) => setField("phone", e.target.value)} fullWidth />
        </Grid>

        {sellerExtras && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Store Name" value={sellerExtras.storeName} onChange={(e) => sellerExtras.onChange({ storeName: e.target.value })} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Business Type" value={sellerExtras.businessType} onChange={(e) => sellerExtras.onChange({ businessType: e.target.value })} fullWidth placeholder="Pharmacy / Hospital / Wholesale / Online…" />
            </Grid>
          </>
        )}
      </Grid>
    </Stack>
  );
}
