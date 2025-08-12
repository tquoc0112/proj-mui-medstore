import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import type { Address } from "../../types/profile";

export default function AddressForm({
  address,
  updateAddress,
}: {
  address?: Address;
  updateAddress: (patch: Partial<Address>) => void;
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField label="Address line 1" value={address?.line1 || ""} onChange={(e) => updateAddress({ line1: e.target.value })} fullWidth />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField label="Address line 2" value={address?.line2 || ""} onChange={(e) => updateAddress({ line2: e.target.value })} fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField label="City" value={address?.city || ""} onChange={(e) => updateAddress({ city: e.target.value })} fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField label="ZIP/Postal" value={address?.zip || ""} onChange={(e) => updateAddress({ zip: e.target.value })} fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField label="Country" value={address?.country || ""} onChange={(e) => updateAddress({ country: e.target.value })} fullWidth />
      </Grid>
    </Grid>
  );
}
