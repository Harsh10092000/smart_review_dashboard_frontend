import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context2/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TableHead from "../../components/Table/TableHead";
import { DateFormat } from "../../components/Functions";
import "../../components/Table/table.css";
import Filter from "../../components/Table/Filter";
import SearchBar from "../../components/Table/SearchBar";

import SkeletonTable from "../../components/Table/SkeletonTable";
import NoData from "../../components/Table/NoData";
import TablePagination from "../../components/Table/TablePagination";
import {
  ArrowDown,
  ArrowUp,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../components/SvgIcons";
import DeleteDialog from "../../components/dialogComp/DeleteDialog";
import Loader from "../../components/loader/Loader";


import {
  IconBan,
  IconCircleCheck
} from '@tabler/icons-react';

const ActionDropdownMenu = [
  { to: "/viewUser", title: "View User", icon: <ViewIcon /> },
  { title: "Active/Block", icon: null }, // Dynamic icon handled in render
  { to: "/deleteUser", title: "Delete User", icon: <DeleteIcon /> },
];

const ActionBtnDropdown = ({ userId, selectedItem, onAction, isActive }) => {
  return (
    <div className="action-dropdown css-1dhh8jv">
      <span className="css-1egvoax"></span>
      {ActionDropdownMenu.map((item) => (
        <div
          key={item.title}
          className={`action-dropdown-item ${selectedItem === item.title ? "selected-action" : ""} ${item.title === 'Active/Block' ? (isActive ? 'text-danger' : 'text-success') : ''}`}
          onClick={() => onAction(userId, item.title, item.to)}
        >
          <span className="action-dropdown-icon">
            {item.title === 'Active/Block' ? (
              isActive ? <IconBan size={18} /> : <IconCircleCheck size={18} />
            ) : (
              item.icon
            )}
          </span>
          {item.title === 'Active/Block' ? (isActive ? 'Block User' : 'Activate User') : item.title}
        </div>
      ))}
    </div>
  );
};

const AllRegUsers = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const [data, setData] = useState([]);
  const [snackQ, setSnackQ] = useState(false);
  const [snack, setSnack] = useState(false);
  const [loader, setLoader] = useState(false);
  const [change, setChange] = useState(0);
  const [selectedAction, setSelectedAction] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [snackDel, setSnackDel] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("All");
  const [userTypes, setUserTypes] = useState([]);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [openDel, setOpenDel] = useState(false);
  const [delId, setDelId] = useState("");

  // Demo User State
  const [openDemoDialog, setOpenDemoDialog] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  const handleClickOpenDel = (data) => {
    setDelId(data);
    setOpenDel(true);
  };

  const handleCloseDel = () => {
    setOpenDel(false);
  };

  useEffect(() => {
    if (currentUser != null) {
      axios
        .get(
          import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV +
            `/api/users`
        )
        .then((res) => {
          if (res.data === "failed") {
            console.error("Failed to fetch users");
          } else {
            const formattedData = res.data.map((item, i) => ({
              ...item,
              serial_no: i + 1,
            }));

            const uniqueUserTypes = [
              "All",
              ...new Set(
                res.data
                  .map((item) => item.user_type || "Regular")
                  .filter((type) => type)
              ),
            ];

            setData(formattedData);
            setUserTypes(uniqueUserTypes);
            setDataLoaded(true);
          }
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setDataLoaded(true);
        });
    }
  }, [change, currentUser]);

  // Filter data based on search and filter
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        // First apply the user type filter
        if (filter === "All") {
          return true;
        }
        return (item.user_type || "Regular") === filter;
      })
      .filter((item) => {
        // Then apply search filter
        if (!searchValue) return true;
        const normalizedSearch = searchValue.toLowerCase();
        return (
          item.name?.toLowerCase().includes(normalizedSearch) ||
          item.email?.toLowerCase().includes(normalizedSearch) ||
          item.phone?.includes(searchValue) ||
          item.id?.toString().includes(searchValue)
        );
      });
  }, [data, filter, searchValue]);

  // Add counts computation
  const userCounts = useMemo(() => {
    return {
      totalCount: data.length,
      activeCount: data.filter(item => item.status === 'active').length,
      inactiveCount: data.filter(item => item.status === 'inactive').length
    };
  }, [data]);

  const nPages = Math.ceil(filteredData.length / recordsPerPage);

  // Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Sort data function
  const sortData = (data, field, direction) => {
    if (!field) return data;

    return [...data].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle special cases
      if (field === 'created_at' || field === 'updated_at' || field === 'last_login') {
        aValue = DateFormat(aValue);
        bValue = DateFormat(bValue);
      }

      // Convert to string for comparison
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();

      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  const sortedData = sortData(filteredData, sortField, sortDirection);
  const records = sortedData.slice(firstIndex, lastIndex);

  const theadArray = [
    {
      value: "ID",
      customClass: "div-table-cell-flex-0-3",
      sortable: true,
      field: 'id',
      currentSort: sortField === 'id' ? sortDirection : null
    },
    {
      value: "User Details",
      sortable: false
    },
    {
      value: "Business Info",
      sortable: true,
      field: 'business_name',
      currentSort: sortField === 'business_name' ? sortDirection : null
    },
    {
      value: "Type",
      customClass: "mobile-hidden-field",
      sortable: true,
      field: 'business_type',
      currentSort: sortField === 'business_type' ? sortDirection : null
    },
    {
      value: "Address",
      customClass: "mobile-hidden-field",
      sortable: true,
      field: 'address',
      currentSort: sortField === 'address' ? sortDirection : null
    },
    {
      value: "Review URL",
      customClass: "mobile-hidden-field",
      sortable: false
    },
    {
      value: "Plan",
      customClass: "mobile-hidden-field",
      sortable: true,
      field: 'plan_name',
      currentSort: sortField === 'plan_name' ? sortDirection : null
    },
    {
      value: "Status",
      customClass: "mobile-hidden-field",
      sortable: true,
      field: 'is_active',
      currentSort: sortField === 'is_active' ? sortDirection : null
    },
    {
      value: "Joined On",
      customClass: "div-table-cell-date",
      sortable: true,
      field: 'created_at',
      currentSort: sortField === 'created_at' ? sortDirection : null
    },
    {
      value: "Actions",
      customClass: "div-table-cell-action-btn",
      sortable: false
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update the deleteUser function
  const deleteUser = async () => {
    try {
      setLoader(true);
      const response = await axios.delete(
        import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV + `/api/admin/deleteUser/${delId}`
      );

      if (response.data.success) {
        setChange(change + 1);
        setSnackDel(true);
        setOpenDel(false);
      } else {
        setSnackQ(true);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setSnackQ(true);
    } finally {
      setLoader(false);
    }
  };

  const handleAction = async (userId, action, to) => {
    setSelectedItem(action);
    setOpenDropdownId(null);
    try {
      switch (action) {
        case "View User":
          navigate(`${to}/${userId}`);
          break;
        case "Edit User":
          // Temporary redirect to View User until Edit page is built
          navigate(`/viewUser/${userId}`);
          break;
        case "Active/Block":
          // Find the user to get current status
          const user = data.find(u => u.id === userId);
          if (user) handleToggleStatus(userId, user.is_active);
          break;
        case "Delete User":
          setDelId(userId);
          setOpenDel(true);
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      setSnackQ(true);
    }

    setTimeout(() => setSelectedItem(null), 300);
  };

  // Toggle User Status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoader(true);
      const newStatus = currentStatus ? 0 : 1; // Toggle 1/0
      await axios.put(
        import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV + `/api/users/${id}/status`,
        { is_active: newStatus }
      );
      setChange(prev => prev + 1);
      setSnack(true);
    } catch (err) {
      console.error("Error updating status:", err);
      setSnackQ(true);
    } finally {
      setLoader(false);
    }
  };

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Create Demo User
  const handleCreateDemoUser = async () => {
    if (!demoForm.name || !demoForm.email || !demoForm.password) {
      alert('Name, Email and Password are required');
      return;
    }
    setDemoLoading(true);
    try {
      const res = await axios.post(
        (import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV) + '/api/admin/createDemoUser',
        demoForm,
        { withCredentials: true }
      );
      if (res.data.success) {
        setDemoResult(res.data.credentials);
        setChange(change + 1); // Refresh list
      } else {
        alert(res.data.message || 'Failed to create demo user');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating demo user');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="dashboard-main-wrapper">
      <DeleteDialog open={openDel} handleClose={handleCloseDel} deleteProperty={deleteUser} deleteHeading={"Delete this User?"} deleteContent={"Are you sure want to delete this user? You will not be able to recover it."} />

      <Snackbar
        ContentProps={{
          sx: {
            background: "green",
            color: "white",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackDel}
        autoHideDuration={1000}
        onClose={() => setSnackDel(false)}
        message={"User Deleted Successfully"}
      />

      {loader ? <Loader /> : ""}

      <Snackbar
        ContentProps={{
          sx: {
            background: "red",
            color: "white",
            textAlign: "center",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackQ}
        autoHideDuration={1000}
        onClose={() => setSnackQ(false)}
        message={"Operation Failed"}
      />

      <Snackbar
        ContentProps={{
          sx: {
            background: "green",
            color: "white",
            textAlign: "center",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack}
        autoHideDuration={1000}
        onClose={() => setSnack(false)}
        message={"Operation Successful"}
      />

      {/* Create Demo User Dialog */}
      <Dialog open={openDemoDialog} onClose={() => { setOpenDemoDialog(false); setDemoResult(null); setDemoForm({ name: '', email: '', phone: '', password: '' }); }} maxWidth="sm" fullWidth>
        <DialogTitle>Create Demo User</DialogTitle>
        <DialogContent>
          {demoResult ? (
            <div style={{ padding: '20px 0' }}>
              <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <strong>Demo user created successfully!</strong>
              </div>
              <p><strong>Email:</strong> {demoResult.email}</p>
              <p><strong>Password:</strong> {demoResult.password}</p>
              <p style={{ fontSize: 12, color: '#666', marginTop: 16 }}>Share these credentials with the demo user. Plan: Demo (2 days)</p>
            </div>
          ) : (
            <>
              <DialogContentText style={{ marginBottom: 16 }}>
                Create a demo account with 2-day trial access to all features.
              </DialogContentText>
              <TextField label="Name" fullWidth margin="dense" value={demoForm.name} onChange={e => setDemoForm({ ...demoForm, name: e.target.value })} />
              <TextField label="Email" type="email" fullWidth margin="dense" value={demoForm.email} onChange={e => setDemoForm({ ...demoForm, email: e.target.value })} />
              <TextField label="Phone (Optional)" fullWidth margin="dense" value={demoForm.phone} onChange={e => setDemoForm({ ...demoForm, phone: e.target.value })} />
              <TextField label="Password" type="text" fullWidth margin="dense" value={demoForm.password} onChange={e => setDemoForm({ ...demoForm, password: e.target.value })} helperText="You will share this with the user" />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDemoDialog(false); setDemoResult(null); setDemoForm({ name: '', email: '', phone: '', password: '' }); }}>{demoResult ? 'Close' : 'Cancel'}</Button>
          {!demoResult && <Button onClick={handleCreateDemoUser} variant="contained" disabled={demoLoading}>{demoLoading ? 'Creating...' : 'Create Demo User'}</Button>}
        </DialogActions>
      </Dialog>

      <div className="dashboard-main-filters">
        <div className="row">
          <div className="col-md-3">
            <Filter
              filterOptions={userTypes}
              value={filter}
              onChange={(value) => {
                setFilter(value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-md-7">
            <SearchBar
              value={searchValue}
              onChange={(value) => {
                setSearchValue(value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-md-2">
            <Button variant="contained" color="primary" onClick={() => navigate('/create-demo-user')} style={{ height: '100%', width: '100%' }}>
              + Demo User
            </Button>
          </div>
        </div>
      </div>

      <div className="div-table">
        <TableHead theadArray={theadArray} onSort={handleSort} />
        <div className="div-table-body">
          {!dataLoaded ? (
            <SkeletonTable count={recordsPerPage} />
          ) : records.length > 0 ? (
            records.map((item) => (
              <div className="div-table-row" key={item.id}>
                <div className="div-table-cell div-table-cell-flex-0-3">{item.id}</div>
                <div className="div-table-cell">
                  <div style={{ fontWeight: 600, color: "#222" }}>{item.name || "N/A"}</div>
                  <div><Link className="text-decoration-none" to={`mailto:${item.email}`} target="_blank">{item.email}</Link></div>
                  <div><Link className="text-decoration-none" to={`https://api.whatsapp.com/send/?phone=${item.phone}`} target="_blank">{item.phone || "N/A"}</Link></div>
                </div>
                <div className="div-table-cell">
                  {item.business_name || <span style={{ color: '#999', fontStyle: 'italic' }}>No Business</span>}
                </div>
                <div className="div-table-cell mobile-hidden-field">
                  {item.business_type || "-"}
                </div>
                <div className="div-table-cell mobile-hidden-field">
                  {item.address || (item.city ? `${item.city}, ${item.state}` : "-")}
                </div>
                <div className="div-table-cell mobile-hidden-field">
                  {item.subdomain && item.qr_token ? (
                    <a href={`https://${item.subdomain}.bizease.com?id=${item.qr_token}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px' }}>
                      View Page
                    </a>
                  ) : item.slug ? (
                    <a href={`${import.meta.env.VITE_WEBSITE_URL || 'https://smartreviewpanel.bizease.com'}/${item.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px' }}>
                      View Page
                    </a>
                  ) : <span className="text-muted small">-</span>}
                </div>
                <div className="div-table-cell mobile-hidden-field">
                  {item.plan_name ? (
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{item.plan_name}</div>
                      {item.sub_end_date && (
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          {Math.max(0, Math.ceil((new Date(item.sub_end_date) - new Date()) / (1000 * 60 * 60 * 24)))} days left
                        </div>
                      )}
                    </div>
                  ) : <span className="text-muted small">No Plan</span>}
                </div>
                <div className="div-table-cell mobile-hidden-field">
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 500,
                    backgroundColor: item.is_active ? "#e6f4ea" : "#ffebee",
                    color: item.is_active ? "#1e7e34" : "#c62828",
                    cursor: "pointer",
                    border: "1px solid " + (item.is_active ? "#1e7e34" : "#c62828")
                  }}
                    onClick={() => handleToggleStatus(item.id, item.is_active)}
                    title="Click to Toggle Status"
                  >
                    {item.is_active ? "Active" : "Blocked"}
                  </span>
                </div>
                <div className="div-table-cell div-table-cell-date">
                  {item.created_at ? DateFormat(item.created_at) : "-"}
                </div>

                <div
                  onClick={() =>
                    setOpenDropdownId(
                      openDropdownId === item.id ? null : item.id
                    )
                  }
                  className="div-table-cell div-table-cell-action-btn action-btn-wrapper"
                >
                  <span className="action-btn">
                    Action{" "}
                    <span>
                      {openDropdownId === item.id ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}
                    </span>
                  </span>
                  {openDropdownId === item.id && (
                    <ActionBtnDropdown
                      userId={item.id}
                      selectedItem={selectedItem}
                      onAction={handleAction}
                      isActive={item.is_active}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="div-table-row-block">
              <div
                className="div-table-cell"
                style={{
                  gridColumn: "span 8",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <NoData />
              </div>
            </div>
          )}
        </div>
        {records.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={nPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default AllRegUsers;
