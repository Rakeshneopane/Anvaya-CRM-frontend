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
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "react-hot-toast";

export default function App(){
  return(
    <div>
      <Toaster position="top-right" />
      <LeadProvider>
        <AgentProvider>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/leadManagement/:leadId" element={<LeadManagement />}></Route>
            <Route path="/addNewSalesAgent" element={<AddNewSalesAgent />}></Route>
            <Route path="/leadList" element={<LeadList />}></Route>
            <Route path="/leadsByStatus" element={<LeadsByStatus />}></Route>
            <Route path="/newLead" element={<NewLead />}></Route>
            <Route path="/editLead/:leadId" element={<NewLead />}></Route>
            <Route path="/reports" element={<Reports />}></Route>
            <Route path="/SalesAgentView" element={<SalesAgentView />}></Route>
            <Route path="/SalesManagement" element={<SalesManagement />}></Route>
            <Route path="/Settings" element={<Settings />}></Route>
          </Routes>
        </AgentProvider>
      </LeadProvider>
    </div>
  )
}