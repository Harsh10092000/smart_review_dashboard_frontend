import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconCreditCard, IconCircleCheck, IconAlertCircle, IconClock } from "@tabler/icons-react";

const Subscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    const backendUrl = import.meta.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_BACKEND_PROD
        : import.meta.env.VITE_BACKEND_DEV;

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await axios.get(
                `${backendUrl}/api/subscription/current`,
                { withCredentials: true }
            );
            if (res.data.active) {
                setSubscription(res.data.subscription);
            }
        } catch (err) {
            console.log("Could not fetch subscription", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '0 20px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

            <div style={{ marginBottom: 40, marginTop: 20 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", letterSpacing: '-0.5px' }}>
                    My Subscription
                </h1>
                <p style={{ color: "#64748b", fontSize: 16, marginTop: 4 }}>
                    Manage your billing and plan details.
                </p>
            </div>

            {loading ? (
                <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading details...</div>
            ) : subscription ? (
                <div style={{
                    background: 'white',
                    borderRadius: 24,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        padding: '40px',
                        borderBottom: '1px solid #bae6fd'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: 20,
                                    background: 'white', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 10px 30px rgba(56, 189, 248, 0.2)'
                                }}>
                                    <IconCreditCard size={40} color="#0ea5e9" />
                                </div>
                                <div>
                                    <div style={{
                                        textTransform: 'uppercase', fontSize: 12, fontWeight: 700,
                                        color: '#0ea5e9', letterSpacing: 1, marginBottom: 8
                                    }}>
                                        Current Plan
                                    </div>
                                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                        {subscription.plan_name || 'Standard Plan'}
                                    </h2>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: subscription.status === 'active' ? '#dcfce7' : '#fee2e2',
                                    padding: '8px 16px', borderRadius: 50,
                                    color: subscription.status === 'active' ? '#166534' : '#991b1b',
                                    fontWeight: 700, fontSize: 14
                                }}>
                                    {subscription.status === 'active' ? <IconCircleCheck size={18} /> : <IconAlertCircle size={18} />}
                                    {subscription.status === 'active' ? 'Active Subscription' : 'Inactive'}
                                </div>
                                <div style={{ marginTop: 12, color: '#475569', fontSize: 14, fontWeight: 500 }}>
                                    Valid until <strong>{new Date(subscription.end_date).toLocaleDateString()}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: 40 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30 }}>
                            <div>
                                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#64748b', marginBottom: 15 }}>Usage & Limits</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 12 }}>
                                        <span style={{ color: '#334155', fontWeight: 500 }}>Time Remaining</span>
                                        {(() => {
                                            const daysLeft = Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                                            const isExpired = daysLeft <= 0;
                                            const isLastDay = daysLeft === 1;
                                            return (
                                                <span style={{
                                                    fontWeight: 700,
                                                    color: isExpired ? '#dc2626' : isLastDay ? '#ea580c' : '#1e293b'
                                                }}>
                                                    {isExpired ? '⚠️ Expired' : isLastDay ? '⏰ Last Day!' : `${daysLeft} days left`}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 12 }}>
                                        <span style={{ color: '#334155', fontWeight: 500 }}>Start Date</span>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{new Date(subscription.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#64748b', marginBottom: 15 }}>Actions</h4>
                                <button disabled style={{
                                    width: '100%', padding: '16px', borderRadius: 12,
                                    border: '1px dashed #cbd5e1', background: 'transparent',
                                    color: '#64748b', fontWeight: 600, cursor: 'not-allowed',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                                }}>
                                    <IconClock size={20} />
                                    Change Plan (Contact Admin)
                                </button>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>
                                    To upgrade or extend your plan, please contact support.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{
                    padding: 60, textAlign: 'center', background: '#fff', borderRadius: 24,
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}>
                    <div style={{
                        width: 60, height: 60, background: '#fef2f2', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                    }}>
                        <IconAlertCircle size={32} color="#ef4444" />
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>No Active Subscription</h3>
                    <p style={{ color: '#64748b', maxWidth: 400, margin: '0 auto' }}>
                        You currently do not have an active subscription plan. Please contact the administrator to get started.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Subscription;
