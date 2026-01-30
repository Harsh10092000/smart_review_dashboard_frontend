
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
  // Main Dashboard (same layout for both admin and user)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
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
  // User Dashboard Routes (same layout, different pages)
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
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
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


