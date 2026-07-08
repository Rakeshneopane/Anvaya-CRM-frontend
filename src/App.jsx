import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LeadManagement from './pages/LeadManagement';
import AddNewSalesAgent from './pages/AddNewSalesAgent';
import LeadList from './pages/LeadList';
import LeadsByStatus from './pages/LeadsByStatus';
import NewLead from './pages/NewLead';
import Reports from './pages/Reports';
import SalesAgentView from './pages/SalesAgentView';
import SalesManagement from './pages/SalesManagement';
import Settings from './pages/Settings';

import LeadProvider from './contexts/leadContext';
import AgentProvider from './contexts/agentContext';

import "bootstrap/dist/css/bootstrap.min.css";

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Login, Signup } from './pages/Login.jsx';

export default function App(){
  return(
    <div>
      <Toaster position="top-right" />
      <LeadProvider>
        <AgentProvider>
          
          <Routes>
            <Route path="/" element={  <Home /> }></Route>
            <Route path="/login/*" element={<Login />}></Route>
            <Route path="/signup/*" element={<Signup />}></Route>
            
            <Route path="/leadManagement/:leadId" element={ <ProtectedRoute>  <LeadManagement /> </ProtectedRoute>}></Route>
            <Route path="/addNewSalesAgent" element={<ProtectedRoute> <AddNewSalesAgent /> </ProtectedRoute>}></Route>
            <Route path="/leadList" element={<ProtectedRoute> <LeadList /> </ProtectedRoute>}></Route>
            <Route path="/leadsByStatus" element={ <ProtectedRoute> <LeadsByStatus /> </ProtectedRoute> }></Route>
            <Route path="/newLead" element={ <ProtectedRoute> <NewLead /> </ProtectedRoute> }></Route>
            <Route path="/editLead/:leadId" element={<ProtectedRoute> <NewLead /> </ProtectedRoute>}></Route>
            <Route path="/reports" element={<ProtectedRoute> <Reports /> </ProtectedRoute>}></Route>
            <Route path="/SalesAgentView" element={<ProtectedRoute><SalesAgentView /> </ProtectedRoute>}></Route>
            <Route path="/SalesManagement" element={<ProtectedRoute> <SalesManagement /> </ProtectedRoute>}></Route>
            <Route path="/Settings" element={<ProtectedRoute> <Settings /> </ProtectedRoute>}></Route>
            <Route path="/unauthorized-sign-in" element={<div> Unauthorised </div>} />
            <Route
              path="/login/sso-callback"
              element={<div>SSO callback reached</div>}
            />
          </Routes> 
        </AgentProvider>
      </LeadProvider>
    </div>
  )
}