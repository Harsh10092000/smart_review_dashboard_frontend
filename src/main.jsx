import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//import { AuthContextProvider } from './context/AuthContext.jsx'
import { AuthContextProvider } from './context2/AuthContext.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
)
