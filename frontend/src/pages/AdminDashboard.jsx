import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import API from "../utils/api";
import { DataGrid } from "@mui/x-data-grid";

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

  const handleDownloadAudit = async () => {
    try {
      const res = await API.get("/admin/audit/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "audit_logs.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-slate-100
      px-4
      py-10
      lg:px-10
    "
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div
          className="
          mb-10
          flex
          flex-col
          gap-6
          rounded-[32px]
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
        >
          <div>
            <span
              className="
              rounded-full
              bg-orange-100
              px-4
              py-2
              text-sm
              font-semibold
              text-orange-600
            "
            >
              Admin Control Center
            </span>

            <h1
              className="
              mt-5
              text-4xl
              font-bold
              tracking-tight
              text-slate-900
            "
            >
              Admin Dashboard
            </h1>

            <p
              className="
              mt-2
              text-lg
              text-slate-500
            "
            >
              Manage products, users, and audit records.
            </p>
          </div>

          <button
            onClick={handleDownloadAudit}
            className="
            rounded-2xl
            bg-slate-900
            px-6
            py-4
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-105
            hover:bg-slate-800
          "
          >
            Download Audit Logs
          </button>
        </div>

        {/* PRODUCTS TABLE */}
        <div
          className="
          overflow-hidden
          rounded-[32px]
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        "
        >
          <div
            className="
            mb-5
            flex
            items-center
            justify-between
          "
          >
            <div>
              <h2
                className="
                text-2xl
                font-bold
                text-slate-900
              "
              >
                Product Inventory
              </h2>

              <p
                className="
                mt-1
                text-slate-500
              "
              >
                Click a product to view interested users.
              </p>
            </div>

            <div
              className="
              rounded-2xl
              bg-slate-100
              px-5
              py-3
            "
            >
              <span className="text-sm text-slate-500">Total Products</span>

              <div
                className="
                text-2xl
                font-bold
                text-slate-900
              "
              >
                {data?.length || 0}
              </div>
            </div>
          </div>

          <div style={{ height: 500 }}>
            <DataGrid
              rows={data || []}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              onRowClick={(params) => handleRowClick(params.row.id)}
              sx={{
                border: "none",
                fontSize: "15px",

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  fontWeight: 700,
                },

                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f8fafc",
                },

                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f1f5f9",
                },
              }}
            />
          </div>
        </div>

        {/* USERS TABLE */}
        {selectedProduct && (
          <div
            className="
            mt-10
            overflow-hidden
            rounded-[32px]
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
          >
            <div className="mb-5">
              <span
                className="
                rounded-full
                bg-emerald-100
                px-4
                py-2
                text-sm
                font-semibold
                text-emerald-700
              "
              >
                Interested Customers
              </span>

              <h2
                className="
                mt-4
                text-2xl
                font-bold
                text-slate-900
              "
              >
                Users who added{" "}
                <span className="text-orange-500">{selected?.title}</span>
              </h2>
            </div>

            {loadingUsers ? (
              <p className="text-slate-500">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-slate-500">
                No users have added this product.
              </p>
            ) : (
              <div style={{ height: 400 }}>
                <DataGrid
                  rows={userRows}
                  columns={userColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  sx={{
                    border: "none",
                    fontSize: "15px",

                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: 700,
                    },

                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#f8fafc",
                    },

                    "& .MuiDataGrid-cell": {
                      borderBottom: "1px solid #f1f5f9",
                    },
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
