import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import API from "../utils/api";
import { DataGrid } from "@mui/x-data-grid";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await API.get("/admin/products");
      return res.data;
    },
  });

  const handleRowClick = async (productId) => {
    try {
      setLoadingUsers(true);
      const res = await API.get(`/admin/products/${productId}/users`);
      setUsers(res.data.cart || []);
      setSelectedProduct(productId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  if (isLoading) return <p className="loading-text">Loading...</p>;

  if (isError) {
    return (
      <p className="error-text">{error.message || "Something went wrong"}</p>
    );
  }

  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "seller",
      headerName: "Seller",
      width: 180,
      renderCell: (params) => params.row?.user?.name || "N/A",
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 200,
      renderCell: (params) => new Date(params.row?.createdAt).toLocaleString(),
    },
  ];

  const userColumns = [
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "createdAt",
      headerName: "Registered",
      width: 200,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 100,
    },
  ];

  const selected = data?.find((p) => p.id === selectedProduct);

  const userRows = users.map((item) => ({
    id: item.user.id,
    name: item.user.name,
    email: item.user.email,
    createdAt: item.user.createdAt,
    quantity: item.quantity,
  }));

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="table-wrapper">
        <DataGrid
          rows={data || []}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          onRowClick={(params) => handleRowClick(params.row.id)}
          sx={{
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
          }}
        />
      </div>

      {selectedProduct && (
        <div className="users-section">
          <h3>
            Users who added: <span className="userH">{selected?.title}</span>
          </h3>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users have added this product</p>
          ) : (
            <div style={{ height: 400 }}>
              <DataGrid
                rows={userRows}
                columns={userColumns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
