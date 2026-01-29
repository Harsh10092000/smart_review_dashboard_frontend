import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    IconPlus, IconTrash, IconSettings, IconTicket, IconEdit
} from '@tabler/icons-react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
    Snackbar, Alert, Checkbox
} from '@mui/material';
import "../../components/Table/table.css"; // Ensure this path is correct
import "./SubscriptionManager.css";
import TableHead from "../../components/Table/TableHead";
import { DateFormat } from "../../components/Functions";
import NoData from "../../components/Table/NoData";

const SubscriptionManager = () => {
    const [activeTab, setActiveTab] = useState(0); // 0: Plans, 1: Coupons
    const [plans, setPlans] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(0);

    // Modal States
    const [openPlanModal, setOpenPlanModal] = useState(false);
    const [openCouponModal, setOpenCouponModal] = useState(false);
    const [isEditingCoupon, setIsEditingCoupon] = useState(false);
    const [isEditingPlan, setIsEditingPlan] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null, name: '' });
    const [snack, setSnack] = useState({ open: false, message: '', type: 'success' });

    // Plan Form
    const [planForm, setPlanForm] = useState({
        id: null,
        name: '', price: '', interval_type: 'monthly', duration_days: 30,
        limit_reviews: 5, limit_keywords: 3, limit_platforms: 2,
        limit_qr: true, limit_owner: true
    });

    // Coupon Form
    const [couponForm, setCouponForm] = useState({
        id: null,
        code: '', discount_type: 'percent', discount_value: '',
        max_uses: 0, valid_from: '', expiry_date: '', applicable_plans: []
    });

    const API_URL = import.meta.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_BACKEND_PROD
        : import.meta.env.VITE_BACKEND_DEV;

    useEffect(() => {
        fetchData();
    }, [change]);

    const fetchData = async () => {
        try {
            const [plansRes, couponsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/fetchPlans`),
                axios.get(`${API_URL}/api/admin/fetchSystemCoupons`)
            ]);
            setPlans(plansRes.data);
            setCoupons(couponsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePlan = async () => {
        try {
            // Fix Duration Logic
            let days = 30;
            if (planForm.interval_type === 'yearly') days = 365;
            if (planForm.interval_type === 'lifetime') days = 36500; // 100 years

            const payload = {
                id: planForm.id,
                name: planForm.name,
                price: planForm.price,
                interval_type: planForm.interval_type,
                duration_days: days,
                limits_config: {
                    review_limit: parseInt(planForm.limit_reviews) || 0,
                    keyword_limit: parseInt(planForm.limit_keywords) || 0,
                    platform_limit: parseInt(planForm.limit_platforms) || 0,
                    qr_generation: true, // Always true as requested
                    allow_owner_name: planForm.limit_owner
                }
            };

            if (isEditingPlan) {
                await axios.put(`${API_URL}/api/admin/updatePlan`, payload);
                setSnack({ open: true, message: 'Plan Updated!', type: 'success' });
            } else {
                await axios.post(`${API_URL}/api/admin/createPlan`, payload);
                setSnack({ open: true, message: 'Plan Created!', type: 'success' });
            }

            setChange(prev => prev + 1);
            setOpenPlanModal(false);
        } catch (error) {
            setSnack({ open: true, message: 'Failed to save plan', type: 'error' });
        }
    };

    const handleOpenCreatePlan = () => {
        setPlanForm({
            id: null,
            name: '', price: '', interval_type: 'monthly', duration_days: 30,
            limit_reviews: 5, limit_keywords: 3, limit_platforms: 2,
            limit_qr: true, limit_owner: true
        });
        setIsEditingPlan(false);
        setOpenPlanModal(true);
    };

    const handleOpenEditPlan = (plan) => {
        setPlanForm({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            interval_type: plan.interval_type,
            duration_days: plan.duration_days,
            limit_reviews: plan.limits_config?.review_limit || 0,
            limit_keywords: plan.limits_config?.keyword_limit || 0,
            limit_platforms: plan.limits_config?.platform_limit || 0,
            limit_qr: true,
            limit_owner: plan.limits_config?.allow_owner_name || false
        });
        setIsEditingPlan(true);
        setOpenPlanModal(true);
    };

    const openDeleteConfirm = (type, id, name) => {
        setDeleteConfirm({ open: true, type, id, name });
    };

    const handleConfirmDelete = async () => {
        try {
            if (deleteConfirm.type === 'plan') {
                await axios.delete(`${API_URL}/api/admin/deletePlan/${deleteConfirm.id}`);
                setSnack({ open: true, message: 'Plan Deleted', type: 'success' });
            } else if (deleteConfirm.type === 'coupon') {
                await axios.delete(`${API_URL}/api/admin/deleteSystemCoupon/${deleteConfirm.id}`);
                setSnack({ open: true, message: 'Coupon Deleted', type: 'success' });
            }
            setChange(prev => prev + 1);
        } catch (error) {
            setSnack({ open: true, message: 'Error deleting', type: 'error' });
        } finally {
            setDeleteConfirm({ open: false, type: '', id: null, name: '' });
        }
    };

    const handleSaveCoupon = async () => {
        // Validation: at least 1 plan must be selected
        if (couponForm.applicable_plans.length === 0) {
            setSnack({ open: true, message: 'Please select at least 1 plan', type: 'error' });
            return;
        }
        try {
            if (isEditingCoupon) {
                await axios.put(`${API_URL}/api/admin/updateSystemCoupon`, couponForm);
                setSnack({ open: true, message: 'Coupon Updated!', type: 'success' });
            } else {
                await axios.post(`${API_URL}/api/admin/createSystemCoupon`, couponForm);
                setSnack({ open: true, message: 'Coupon Created!', type: 'success' });
            }
            setChange(prev => prev + 1);
            setOpenCouponModal(false);
        } catch (error) {
            setSnack({ open: true, message: 'Failed to save coupon', type: 'error' });
        }
    };

    const openEditCoupon = (coupon) => {
        setCouponForm({
            id: coupon.id,
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            max_uses: coupon.max_uses,
            valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
            expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '',
            applicable_plans: coupon.applicable_plans || []
        });
        setIsEditingCoupon(true);
        setOpenCouponModal(true);
    };

    const handleOpenCreateCoupon = () => {
        setCouponForm({
            id: null,
            code: '', discount_type: 'percent', discount_value: '',
            max_uses: 0, valid_from: '', expiry_date: '', applicable_plans: []
        });
        setIsEditingCoupon(false);
        setOpenCouponModal(true);
    };


    const generateCode = () => {
        const code = 'PRO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setCouponForm({ ...couponForm, code });
    }

    const couponTableHead = [
        { value: "Code", sortable: false },
        { value: "Discount", sortable: false },
        { value: "Plans", sortable: false },
        { value: "Uses", sortable: false },
        { value: "Valid From", sortable: false },
        { value: "Expiry", sortable: false },
        { value: "Status", sortable: false },
        { value: "Action", sortable: false }
    ];

    const planTableHead = [
        { value: "Name", sortable: false },
        { value: "Price", sortable: false },
        { value: "Interval", sortable: false },
        { value: "Reviews", sortable: false },
        { value: "Keywords", sortable: false },
        { value: "Platforms", sortable: false },
        { value: "Customer Name", sortable: false },
        { value: "Action", sortable: false }
    ];

    const PlanCard = ({ plan, onEdit, onDelete, index }) => (
        <div className="col-md-4" key={plan.id}>
            <div className="pricing-card h-100">
                <div className="pricing-card-header">
                    <h3 className="pricing-plan-name">{plan.name || 'Untitled Plan'}</h3>
                    <span className="pricing-badge">{(plan.interval_type || 'monthly').toUpperCase()}</span>
                </div>
                <div className="pricing-card-body">
                    <div className="pricing-price-section">
                        <span className="pricing-currency">₹</span>
                        <span className="pricing-amount">{plan.price || 0}</span>
                        <span className="pricing-period">/{plan.interval_type === 'yearly' ? 'year' : plan.interval_type === 'lifetime' ? 'life' : 'mo'}</span>
                    </div>

                    <ul className="pricing-features-list">
                        <li className="pricing-feature-item">
                            <span className="pricing-feature-icon check">✓</span>
                            <span>Reviews per day</span>
                            <span className="pricing-feature-value">{plan.limits_config?.review_limit || 0}</span>
                        </li>
                        <li className="pricing-feature-item">
                            <span className="pricing-feature-icon check">✓</span>
                            <span>Keywords</span>
                            <span className="pricing-feature-value">{plan.limits_config?.keyword_limit || 0}</span>
                        </li>
                        <li className="pricing-feature-item">
                            <span className="pricing-feature-icon check">✓</span>
                            <span>Platforms</span>
                            <span className="pricing-feature-value">{plan.limits_config?.platform_limit || 0}</span>
                        </li>
                        <li className="pricing-feature-item">
                            <span className={`pricing-feature-icon ${plan.limits_config?.allow_owner_name ? 'check' : 'cross'}`}>
                                {plan.limits_config?.allow_owner_name ? '✓' : '✗'}
                            </span>
                            <span>Customer Name</span>
                            <span className={`pricing-feature-value ${plan.limits_config?.allow_owner_name ? 'text-success' : 'text-danger'}`}>
                                {plan.limits_config?.allow_owner_name ? 'Yes' : 'No'}
                            </span>
                        </li>
                    </ul>

                    <div className="pricing-card-actions">
                        <button className="pricing-btn pricing-btn-edit" onClick={() => onEdit(plan)}>
                            <IconEdit size={18} /> Edit Plan
                        </button>
                        <button className="pricing-btn pricing-btn-delete" onClick={() => onDelete('plan', plan.id, plan.name)}>
                            <IconTrash size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-main-wrapper p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark m-0">Subscription & Billing</h2>
                    <p className="text-muted m-0">Manage your pricing plans and discount coupons</p>
                </div>
                {activeTab === 1 && (
                    <button className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4" onClick={handleOpenCreateCoupon}>
                        <IconPlus size={18} /> Create Coupon
                    </button>
                )}
                {activeTab === 0 && plans.length < 3 && (
                    <button className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4" onClick={handleOpenCreatePlan}>
                        <IconPlus size={18} /> Create Plan
                    </button>
                )}
            </div>

            {/* Custom Tabs */}
            <div className="d-flex gap-2 mb-4">
                <button
                    className={`btn border-0 rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === 0 ? 'bg-primary text-white shadow' : 'bg-white text-muted shadow-sm'}`}
                    onClick={() => setActiveTab(0)}
                >
                    Subscription Plans
                </button>
                <button
                    className={`btn border-0 rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === 1 ? 'bg-primary text-white shadow' : 'bg-white text-muted shadow-sm'}`}
                    onClick={() => setActiveTab(1)}
                >
                    Coupons
                </button>
            </div>

            {/* PLANS TAB - TABLE LAYOUT */}
            {activeTab === 0 && (
                <div className="div-table">
                    <TableHead theadArray={planTableHead} />
                    <div className="div-table-body">
                        {plans.length > 0 ? (
                            plans.map(plan => (
                                <div className="div-table-row" key={plan.id}>
                                    <div className="div-table-cell fw-bold">{plan.name || 'Untitled'}</div>
                                    <div className="div-table-cell">₹{plan.price || 0}</div>
                                    <div className="div-table-cell">
                                        <span className="badge bg-primary">{(plan.interval_type || 'monthly').toUpperCase()}</span>
                                    </div>
                                    <div className="div-table-cell">{plan.limits_config?.review_limit || 0}</div>
                                    <div className="div-table-cell">{plan.limits_config?.keyword_limit || 0}</div>
                                    <div className="div-table-cell">{plan.limits_config?.platform_limit || 0}</div>
                                    <div className="div-table-cell">
                                        <span className={`badge ${plan.limits_config?.allow_owner_name ? 'bg-success' : 'bg-secondary'}`}>
                                            {plan.limits_config?.allow_owner_name ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="div-table-cell d-flex gap-2">
                                        <button className="btn btn-sm btn-light text-primary border" onClick={() => handleOpenEditPlan(plan)}>
                                            <IconEdit size={16} />
                                        </button>
                                        <button className="btn btn-sm btn-light text-danger border" onClick={() => openDeleteConfirm('plan', plan.id, plan.name)}>
                                            <IconTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="div-table-row-block">
                                <div className="div-table-cell" style={{ gridColumn: "span 8", textAlign: "center", padding: "20px" }}>
                                    <NoData />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 1 && (
                <div className="div-table">
                    <TableHead theadArray={couponTableHead} />
                    <div className="div-table-body">
                        {coupons.length > 0 ? (
                            coupons.map(coupon => (
                                <div className="div-table-row" key={coupon.id}>
                                    <div className="div-table-cell fw-bold text-primary">{coupon.code}</div>
                                    <div className="div-table-cell">
                                        {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                    </div>
                                    <div className="div-table-cell">
                                        {coupon.applicable_plans && coupon.applicable_plans.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {coupon.applicable_plans.map(planId => {
                                                    const plan = plans.find(p => p.id === planId);
                                                    return plan ? (
                                                        <span key={planId} style={{
                                                            background: '#e0f2fe',
                                                            color: '#0369a1',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 500
                                                        }}>
                                                            {plan.name}
                                                        </span>
                                                    ) : null;
                                                })}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#9ca3af' }}>-</span>
                                        )}
                                    </div>
                                    <div className="div-table-cell">{coupon.used_count} / {coupon.max_uses === 0 ? '∞' : coupon.max_uses}</div>
                                    <div className="div-table-cell">{coupon.valid_from ? DateFormat(coupon.valid_from) : '-'}</div>
                                    <div className="div-table-cell">{coupon.expiry_date ? DateFormat(coupon.expiry_date) : 'Never'}</div>
                                    <div className="div-table-cell">
                                        {(() => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            const expiry = coupon.expiry_date ? new Date(coupon.expiry_date) : null;
                                            if (expiry) expiry.setHours(23, 59, 59, 999);

                                            const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
                                            if (validFrom) validFrom.setHours(0, 0, 0, 0);

                                            // Check if dates are invalid (expiry before valid_from)
                                            if (expiry && validFrom && expiry < validFrom) {
                                                return <span className="badge bg-secondary">Invalid</span>;
                                            }

                                            // Check if expired
                                            if (expiry && expiry < today) {
                                                return <span className="badge bg-danger">Expired</span>;
                                            }

                                            // Check if not yet started
                                            if (validFrom && validFrom > today) {
                                                return <span className="badge bg-warning text-dark">Upcoming</span>;
                                            }

                                            return <span className="badge bg-success">Active</span>;
                                        })()}
                                    </div>
                                    <div className="div-table-cell d-flex gap-2">
                                        <button className="btn btn-sm btn-light text-primary border" onClick={() => openEditCoupon(coupon)}>
                                            <IconEdit size={16} />
                                        </button>
                                        <button className="btn btn-sm btn-light text-danger border" onClick={() => openDeleteConfirm('coupon', coupon.id, coupon.code)}><IconTrash size={16} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="div-table-row-block">
                                <div className="div-table-cell" style={{ gridColumn: "span 7", textAlign: "center", padding: "20px" }}>
                                    <NoData />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CREATE PLAN MODAL */}
            <Dialog open={openPlanModal} onClose={() => setOpenPlanModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
                <DialogContent>
                    <div className="d-flex flex-column gap-3 pt-2">
                        <TextField label="Plan Name" fullWidth value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} />
                        <div className="d-flex gap-2">
                            <TextField label="Price (&#8377;)" type="number" fullWidth value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} />
                            <FormControl fullWidth>
                                <InputLabel>Interval</InputLabel>
                                <Select value={planForm.interval_type} label="Interval" onChange={e => setPlanForm({ ...planForm, interval_type: e.target.value })}>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="yearly">Yearly</MenuItem>
                                    <MenuItem value="lifetime">Lifetime</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <h6 className="fw-bold mt-2">Limits</h6>
                        <div className="row g-2">
                            <div className="col-6"><TextField label="Reviews Limit" type="number" fullWidth size="small" value={planForm.limit_reviews} onChange={e => setPlanForm({ ...planForm, limit_reviews: e.target.value })} /></div>
                            <div className="col-6"><TextField label="Keywords Limit" type="number" fullWidth size="small" value={planForm.limit_keywords} onChange={e => setPlanForm({ ...planForm, limit_keywords: e.target.value })} /></div>
                            <div className="col-6"><TextField label="Platform Limit" type="number" fullWidth size="small" value={planForm.limit_platforms} onChange={e => setPlanForm({ ...planForm, limit_platforms: e.target.value })} /></div>
                        </div>
                        <FormControlLabel control={<Switch checked={planForm.limit_owner} onChange={e => setPlanForm({ ...planForm, limit_owner: e.target.checked })} />} label="Allow Owner Name Customization" />
                        {/* QR Generation is now always enabled */}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPlanModal(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSavePlan}>{isEditingPlan ? 'Update Plan' : 'Create Plan'}</Button>
                </DialogActions>
            </Dialog>

            {/* CREATE/EDIT COUPON MODAL */}
            <Dialog open={openCouponModal} onClose={() => setOpenCouponModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
                <DialogContent>
                    <div className="d-flex flex-column gap-3 pt-2">
                        <div className="d-flex gap-2">
                            <TextField label="Coupon Code" fullWidth value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} />
                            <Button variant="outlined" onClick={generateCode}>Autogen</Button>
                        </div>

                        <div className="d-flex gap-2">
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select value={couponForm.discount_type} label="Type" onChange={e => setCouponForm({ ...couponForm, discount_type: e.target.value })}>
                                    <MenuItem value="percent">Percentage (%)</MenuItem>
                                    <MenuItem value="flat">Flat Amount (&#8377;)</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField label="Value" type="number" fullWidth value={couponForm.discount_value} onChange={e => setCouponForm({ ...couponForm, discount_value: e.target.value })} />
                        </div>

                        <div className="d-flex gap-2">
                            <TextField
                                label="Valid From"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                value={couponForm.valid_from}
                                onChange={e => setCouponForm({ ...couponForm, valid_from: e.target.value })}
                            />
                            <TextField
                                label="Expiry Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                value={couponForm.expiry_date}
                                onChange={e => setCouponForm({ ...couponForm, expiry_date: e.target.value })}
                            />
                        </div>

                        <TextField label="Max Uses (0=Unlimited)" type="number" fullWidth value={couponForm.max_uses} onChange={e => setCouponForm({ ...couponForm, max_uses: e.target.value })} />

                        {/* Applicable Plans Section */}
                        <div style={{ marginTop: '16px' }}>
                            <p style={{ margin: '0 0 8px', fontWeight: 500, color: '#374151' }}>Applicable Plans <span style={{ color: '#ef4444' }}>*</span></p>
                            <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: '#6b7280' }}>Select which plans this coupon can be applied to (minimum 1 required)</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {plans.map(plan => (
                                    <label key={plan.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 12px',
                                        border: couponForm.applicable_plans.includes(plan.id) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: couponForm.applicable_plans.includes(plan.id) ? '#eff6ff' : '#fff',
                                        transition: 'all 0.2s'
                                    }}>
                                        <Checkbox
                                            checked={couponForm.applicable_plans.includes(plan.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCouponForm({ ...couponForm, applicable_plans: [...couponForm.applicable_plans, plan.id] });
                                                } else {
                                                    setCouponForm({ ...couponForm, applicable_plans: couponForm.applicable_plans.filter(id => id !== plan.id) });
                                                }
                                            }}
                                            size="small"
                                            sx={{ padding: 0, marginRight: 1 }}
                                        />
                                        <span style={{ fontWeight: 500 }}>{plan.name}</span>
                                        <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '0.875rem' }}>₹{plan.price}</span>
                                    </label>
                                ))}
                            </div>
                            {plans.length === 0 && (
                                <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>No plans available. Create plans first.</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCouponModal(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveCoupon}>{isEditingCoupon ? 'Update' : 'Create'} Coupon</Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION MODAL */}
            <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })} maxWidth="xs" fullWidth>
                <DialogTitle>Delete {deleteConfirm.type === 'plan' ? 'Plan' : 'Coupon'}?</DialogTitle>
                <DialogContent>
                    <p style={{ margin: 0, color: '#4b5563' }}>
                        Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This action cannot be undone.
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>Yes, Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
                <Alert severity={snack.type} variant="filled">{snack.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default SubscriptionManager;
