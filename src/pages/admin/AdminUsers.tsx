// src/pages/admin/AdminUsers.tsx
import { useEffect, useMemo, useState } from "react";
import { Paper, Stack, TextField, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";

const API = "http://localhost:5000";

type Row = {
  id: number;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "SALES";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  firstName: string | null;
  lastName: string | null;
  customerId: string | null;
  sellerId: string | null;
  createdAt: string; // ISO
};

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });

  const token = useMemo(() => localStorage.getItem("token") || "", []);

  const columns: GridColDef<Row>[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 160,
      valueGetter: (_v, row) => {
        const name = `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
        return name || "—";
      },
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      valueGetter: (_v, row) => (row.role === "SALES" ? "SELLER" : row.role),
    },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "code",
      headerName: "Code",
      width: 140,
      valueGetter: (_v, row) => row.customerId ?? row.sellerId ?? "—",
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 160,
      valueGetter: (_v, row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const page = pagination.page + 1; // server is 1-based
      const pageSize = pagination.pageSize;
      const url = new URL(`${API}/api/admin/users`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("pageSize", String(pageSize));
      if (q.trim()) url.searchParams.set("q", q.trim());

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load users");

      setRows(data.rows as Row[]);
      setRowCount(Number(data.total || 0));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.pageSize]);

  return (
    <Paper sx={{ p: 2, borderRadius: 1 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Users
        </Typography>
        <TextField
          size="small"
          placeholder="Search email/name/ID…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
        />
        <Button variant="contained" onClick={fetchUsers}>
          Search
        </Button>
      </Stack>

      <div style={{ height: 560, width: "100%" }}>
        <DataGrid<Row>
          rows={rows}
          columns={columns}
          loading={loading}
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={pagination}
          onPaginationModelChange={(m) => setPagination(m)}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
        />
      </div>
    </Paper>
  );
}
