import Grid from "@mui/material/Grid";
import { Avatar, Divider, Stack, Typography } from "@mui/material";
import type { ProfileDraft } from "../../types/profile";

export default function Review({ draft }: { draft: ProfileDraft }) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={draft.avatarUrl || undefined} sx={{ width: 56, height: 56 }}>
          {(draft.firstName || "U")[0]}
        </Avatar>
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {draft.firstName} {draft.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">{draft.email}</Typography>
        </div>
      </Stack>

      <Divider />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
          <Typography variant="body1">{draft.phone || "-"}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">Address</Typography>
          <Typography variant="body1">
            {[draft.address?.line1, draft.address?.line2, draft.address?.city, draft.address?.zip, draft.address?.country]
              .filter(Boolean)
              .join(", ") || "-"}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  );
}
