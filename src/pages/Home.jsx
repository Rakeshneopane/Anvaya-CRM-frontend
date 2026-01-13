import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLeadContext } from "../contexts/leadContext";

import { toast } from "react-hot-toast";

import Navbar from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileLeadStatusSummary from "../components/MobileStatusSummary";
import MobileSidebar from "../components/MobileSidebar";

/* ================= LEAD LIST ================= */

function LeadList({ leads, deleteLead }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "bg-primary bg-opacity-10 text-primary";
      case "Contacted":
        return "bg-info bg-opacity-10 text-info";
      case "Qualified":
        return "bg-success bg-opacity-10 text-success";
      case "Proposal Sent":
        return "bg-warning bg-opacity-10 text-warning";
      case "Closed":
        return "bg-secondary bg-opacity-10 text-secondary";
      default:
        return "bg-light text-dark";
    }
  };
  return (
    <div className="row g-3" >
      {leads.map((lead, index) => (
        <div key={lead._id} className="col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="fw-bold mb-1">
                    #{index + 1}. {lead.name}
                  </h6>
                  <p className="small text-muted mb-0">
                    Assigned to {lead.salesAgent?.name || "Unassigned"} 
                  </p>
                </div>
                <span 
                  className={`badge rounded-pill px-3 py-1 fw-normal ${getStatusClass(
                    lead.status
                  )}`}
                > {lead.status}
                </span>
              </div>

              <div className="mt-auto">
                <Link 
                  to={`/leadManagement/${lead._id}`}
                  className="btn btn-outline-dark btn-sm w-100"
                > View Lead 
              </Link>
              </div>
              <div className="mt-auto">
                <button
                  onClick={()=>deleteLead({
                    type: "lead", 
                    url:  `http://localhost:3000/api/lead/${lead._id}`,
                    onSuccess: ()=>{
                      toast.success("Deleted successfully");
                    },
                    onError: (error)=>{
                      toast.error(error?.message || "Delete Failed");
                    },
                  })}
                  className="btn btn-outline-dark btn-sm w-100 mt-1"
                > Delete Lead
              </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= STATUS SUMMARY ================= */

function LeadStatusSummary({ filterFunction }) {
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
  const NAVBAR_HEIGHT = 64;
  return (
    <aside
      className="bg-white border-start position-fixed end-0 p-3 overflow-y-auto d-none d-lg-block"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        width: "260px",
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`
      }}
    >
      <h6 className="fw-bold mb-3">Lead Status</h6>

      <div className="d-flex flex-column gap-2">
        {statuses.map((status) => (
          <div 
            key={status}
            className="d-flex justify-content-between align-items-center px-2 py-2 rounded bg-light"
          >
            <span className="small text-muted">{status}</span>
            <span className="fw-bold">
              {filterFunction(status)} 
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ================= QUICK FILTERS ================= */

function QuickFilters({ quickFilter, setQuickFilter }) {
  const statuses = ["","New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <div className="mb-4">
      <div className="btn-group btn-group-md" role="group">
        {statuses.map((status) => {
          const isActive = quickFilter.status === status;

          return (
            <button
              key={status || "all"}
              type="button"
              className={`btn ${isActive ? "btn-dark": "btn-outline-dark"}`}
              onClick={() => setQuickFilter({ ...quickFilter, status })}
            >
              {status || "All"}
            </button>
          )
        }
          )}
      </div>
    </div>
  );
}

/* ================= HOME ================= */

export default function Home() {
  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;
  const RIGHT_PANEL_WIDTH = 260;

  const { leadData, deleteEntity } = useLeadContext();

  const [quickFilter, setQuickFilter] = useState({
    status: "",
    salesAgent: "",
  });

  if (!leadData) return <div>Loading...</div>;

  const processedLead = leadData.filter((lead) => {
    const matchStatus =
      !quickFilter.status || lead.status === quickFilter.status;
    const matchAgent =
      !quickFilter.salesAgent ||
      lead.salesAgent?.name === quickFilter.salesAgent;
    return matchStatus && matchAgent;
  });

  const filterFunction = (status) =>
    processedLead.filter((lead) => lead.status === status).length;

  

  return (
    <div>
        <header>
            <Navbar leads={processedLead}/>
        </header>
      
        <Sidebar />
        
        <main 
         className="main-content with-right-panel"
        >
          {/* Mobile Stack */}
          <MobileSidebar />
          <MobileLeadStatusSummary filterFunction={filterFunction} />

          <div className="mb-4">
            <h1 className="fw-bold mb-3" >Leads</h1>
            <p>Manage and track your sales oppurtunities</p>
          </div>

          <h3>Quick Filters</h3>
          <QuickFilters
            quickFilter={quickFilter}
            setQuickFilter={setQuickFilter}
          />
          
          <LeadList leads={processedLead} deleteLead ={deleteEntity} />

          <Link to="/newLead" className="btn btn-dark my-4" style={{width: "100%"}}>Add New Lead</Link>
        </main>
        <LeadStatusSummary filterFunction={filterFunction} />
        <Footer />
    </div>
  );
}
