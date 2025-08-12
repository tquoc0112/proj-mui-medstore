import { useContext, useMemo, useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton,
  Container, Paper, Stepper, Step, StepLabel,
  Button, Box, Snackbar, Alert
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeContext } from "../../contexts/ThemeContext";
import AccountForm from "./AccountForm";
import AddressForm from "./AddressForm";
import SecurityForm from "./SecurityForm";
import Review from "./Review";
import type { SellerDraft, Address } from "../../types/profile";

const steps = ["Account", "Address", "Security", "Review & Save"];

const initialData: SellerDraft = {
  id: "SEL001",
  email: "seller@example.com",
  firstName: "Taylor",
  lastName: "Pham",
  phone: "+84 988 777 123",
  storeName: "PhamCare Pharmacy",
  businessType: "Pharmacy / Drugstore",
  address: { line1: "45 Le Loi", city: "Da Nang", zip: "50000", country: "Vietnam" }
};

export default function SellerProfile() {
  const { cycle } = useContext(ThemeContext);
  const [activeStep, setActiveStep] = useState(0);
  const [draft, setDraft] = useState<SellerDraft>(initialData);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success"|"error"|"info" }>({ open: false, msg: "", sev: "success" });

  const setField = <K extends keyof SellerDraft>(key: K, value: SellerDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const updateAddress = (patch: Partial<Address>) =>
    setDraft((d) => ({ ...d, address: { ...d.address, ...patch } }));

  const stepContent = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <AccountForm
            draft={draft}
            setField={setField}
            sellerExtras={{
              storeName: draft.storeName ?? "",
              businessType: draft.businessType ?? "",
              onChange: (patch) => setDraft((d) => ({ ...d, ...patch })),
            }}
          />
        );
      case 1: return <AddressForm address={draft.address} updateAddress={updateAddress} />;
      case 2: return <SecurityForm email={draft.email} onResult={(ok, msg) => setSnack({ open: true, msg, sev: ok ? "success" : "error" })} />;
      case 3: return <Review draft={draft} />;
      default: return null;
    }
  }, [activeStep, draft]);

  const handleLogout = () => { localStorage.removeItem("token"); window.location.href = "/"; };

  const handleSaveAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      setSnack({ open: true, msg: "Seller profile updated.", sev: "success" });
    } catch (e: any) {
      setSnack({ open: true, msg: e.message || "Update failed", sev: "error" });
    }
  };

  return (
    <>
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Seller Profile</Typography>
          <IconButton onClick={cycle} aria-label="toggle theme"><Brightness4Icon /></IconButton>
          <IconButton onClick={handleLogout} aria-label="logout" sx={{ ml: 1 }}><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mx: "auto", maxWidth: 720, borderRadius: 3 }}>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Edit your store & details</Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
          </Stepper>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>{stepContent}</Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>Back</Button>
                {activeStep < steps.length - 1 ? (
                  <Button variant="contained" onClick={() => setActiveStep((s) => s + 1)}>Next</Button>
                ) : (
                  <Button variant="contained" onClick={handleSaveAll}>Save All</Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snack.sev} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
