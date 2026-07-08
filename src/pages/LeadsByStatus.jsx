import { useLeadContext } from "../contexts/leadContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Header"
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileSidebar from "../components/MobileSidebar";

/* ================= SIDEBAR ================= */

/* ================= LEAD LIST ================= */

function LeadList({ leads }) {
  if (!leads) return <p>Loading...</p>;
  if (leads.length === 0) 
    return <p className="text-muted">No leads found.</p>;

  return (
    <div className="row g-3">
      {leads.map((lead, index) => (
        <div key={lead._id} className="col-md-6 col-lg-4">
          <div className="card shodow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-1">#{index+1} {lead.name}</h6>
              <p className="small text-muted mb-2">
                Agent: {lead.salesAgent?.name || "Unassigned"}
              </p>

              <div className="d-flex justify-content-between small mb-3">
                <span>Time to close</span>
                <span>{lead.timeToClose} days</span>
              </div>

              <Link
                to={`/leadManagement/${lead._id}`} 
                className="btn btn-outline-dark btn-sm w-100"
              >
                View Leads
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= FILTERS ================= */

function Filters({ quickFilter, setQuickFilter, agents }) {
  const statuses = ["","New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <div className="card shadow-sm my-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Filters</h6>
        
        {/* Status Filter */}
        <div className="mb-3">
          <div className="small text-muted mb-2">Status</div>
          <div className="btn-group btn-group-sm flex-wrap">
            {statuses.map((status)=>(
              <button
                key={status || "all"}
                className={` btn ${
                  quickFilter.status ===status 
                  ? "btn-dark"
                  : "btn-outline-dark"
                }`}
                onClick={()=> 
                  setQuickFilter({...quickFilter, status})
                }
              >
                {status || "All"}
              </button>
            ))}
          </div>
        </div>
        {/* Sales Agent Filter */}
        <div>
          <div className="small text-muted mb-2"> Sales Agent</div>
          <select
            className="foem-select form-select-sm"
            value={quickFilter.salesAgent}
            onChange={(e)=>setQuickFilter({
              ...quickFilter,
              salesAgent: e.target.value,
            })} 
          >
            <option value="">All Agents</option>
            {agents.map((agent)=>(
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </div>
      </div>
      
    </div>
  );
}

/* ================= SORT CONTROLS ================= */

function SortControls({ sortType,setSortType }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3"> Sort By </h6>

        <div className="btn-group btn-group-sm">
          <button
            className={`btn ${
              sortType === "priority" 
              ? "btn-dark"
              : "btn-outline-dark"
            }`}
            onClick={()=>setSortType("priority")}
          >
            Priority
          </button>

          <button
            className={`btn ${
              sortType === "timeToClose" 
              ? "btn-dark"
              : "btn-outline-dark"
            }`}
            onClick={()=>setSortType("timeToClose")}
          >
            Time to close
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSortType("")}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function LeadByStatus() {
  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;
  const { leadData, uniqueSalesAgentName } = useLeadContext();

  const [quickFilter, setQuickFilter] = useState({
    status: "",
    salesAgent: "",
  });

  const [sortType, setSortType] = useState("");

  const priorityObject = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const processedLead = leadData
    .filter((lead) => {
      const matchStatus =
        !quickFilter.status || lead.status === quickFilter.status;
      const matchAgent =
        !quickFilter.salesAgent ||
        lead.salesAgent?.name === quickFilter.salesAgent;
      return matchStatus && matchAgent;
    })
    .sort((a, b) => {
      switch (sortType) {
        case "priority":
          return (
            priorityObject[a.priority] -
            priorityObject[b.priority]
          );
        case "timeToClose":
          return a.timeToClose - b.timeToClose;
        default:
          return 0;
      }
    });

  return (
    <div className="page-wrapper">
      <Navbar />
      <aside>
        <Sidebar />
      </aside>
      <main
        className="main-content"
      >
        <MobileSidebar />
        <h1 className="fw-bold mb-3">Anvaya CRM Reports</h1>

        <section>
          <Filters
            quickFilter={quickFilter}
            setQuickFilter={setQuickFilter}
            agents={uniqueSalesAgentName}
          />
        </section>

        <section>
          <SortControls setSortType={setSortType} />
        </section>
        <section>
          <h4 className="mb-3">Status: {quickFilter.status || "All"}</h4>
          <LeadList leads={processedLead} />
        </section> 

        
      </main>
      <Footer />
    </div>
  );
}
