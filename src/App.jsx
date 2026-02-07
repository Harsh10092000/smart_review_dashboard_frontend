
import { useContext } from 'react';
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import MyProperty from './pages/myProperty/MyProperty'
import { AuthContext } from './context2/AuthContext';
import SessionOutLoginAgain from './components/Table/SessionOutLoginAgain';
import Loading from './components/Loading';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet
} from "react-router-dom";
import Index from './pages/index/Index';
import LoginRequired from './components/Table/LoginRequired';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import UserLogin from './pages/userLogin/UserLogin';
import ChangePassword from './pages/changePassword/ChangePassword';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';
import QRCodeGenerator from './pages/tools/QRCodeGenerator';
import UserQRGenerator from './pages/tools/UserQRGenerator';
import QRCard from './pages/tools/QRCard';
import QRStand from './pages/tools/QRStand';
import BusinessProfile from './pages/businessProfile/BusinessProfile';
import AllRegUsers from './pages/allRegUsers/AllRegUsers';
import ViewUser from './pages/viewUser/ViewUser';
import SubscriptionManager from './pages/subscription/SubscriptionManager';
import Subscription from './pages/subscription/Subscription';
import CreateDemoUser from './pages/createDemoUser/CreateDemoUser';

// Protected Route Component - works for both admin and user
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/user-login" replace />;
  }

  return children ? children : <Outlet />;
};

// Admin Only Route - redirects non-admin users
const AdminRoute = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/user-login" replace />;
  }

  // Check if user is admin
  if (currentUser.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return children ? children : <Outlet />;
};

// User Only Route - redirects admin users to admin dashboard
const UserOnlyRoute = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/user-login" replace />;
  }

  // If admin tries to access user routes, redirect to admin dashboard
  if (currentUser.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/user-login",
    element: <UserLogin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  // Admin Dashboard Routes (admin only)
  {
    path: "/",
    element: (
      <AdminRoute>
        <Index />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="allRegUsers" replace /> },
      // Admin pages
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "allRegUsers",
        element: <AllRegUsers />
      },
      {
        path: "viewUser/:id",
        element: <ViewUser />
      },
      {
        path: "create-demo-user",
        element: <CreateDemoUser />
      },
      {
        path: "subscription-manager",
        element: <SubscriptionManager />
      },
      {
        path: "change-password",
        element: <ChangePassword />
      },
      {
        path: "qr-generator",
        element: <QRCodeGenerator />
      }
    ]
  },
  // User Dashboard Routes (user only - redirects admins)
  {
    path: "/user",
    element: (
      <UserOnlyRoute>
        <Index />
      </UserOnlyRoute>
    ),
    children: [
      { index: true, element: <Navigate to="qr-generator" replace /> },
      {
        path: "qr-generator",
        element: <UserQRGenerator />
      },
      {
        path: "business-profile",
        element: <BusinessProfile />
      },
      {
        path: "qr-card",
        element: <QRCard />
      },
      {

        path: "qr-stand",
        element: <QRStand />
      },
      {
        path: "subscription",
        element: <Subscription />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


