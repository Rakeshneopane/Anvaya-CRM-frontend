import { useState, useMemo } from "react";
import { useLeadContext } from "../contexts/leadContext";
import { useFetch } from "../useFetch";
import { Link } from "react-router-dom";

import Navbar from "../components/Header"
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileSidebar from "../components/MobileSidebar";

/* ================= SIDEBAR ================= */

// function Sidebar() {
//   return (
//     <aside>
//       <Link to="/">Back to Dashboard</Link>
//     </aside>
//   );
// }

/* ================= AGENT FILTERS ================= */

function AgentFilters({ status, setStatus }) {
  const statuses = [
    "",
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];

  return (
     <div className="mb-3">
      <div className="small text-muted mb-2">Filter by status</div>
      <div className="btn-group btn-group-sm flex-wrap">
        {statuses.map((s) => (
          <button
            key={s || "all"}
            className={`btn ${
              status === s ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setStatus(s)}
          >
            {s || "All"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= SORT CONTROLS ================= */

function AgentSortControls({ setSortType }) {
  return (
    <div className="mb-4">
      <div className="small text-muted mb-2">Sort leads</div>
      <div className="btn-group btn-group-sm">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setSortType("priority")}
        >
          Priority
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setSortType("timeToClose")}
        >
          Time to Close
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setSortType("")}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

/* ================= LEAD LIST ================= */

function AgentLeadList({ leads }) {
  if (leads.length === 0) {
    return <p>No leads assigned</p>;
  }

  return (
    <div className="row g-3">
      {leads.map((lead) => (
        <div key={lead._id} className="col-md-6 col-xl-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h6 className="fw-bold mb-1">{lead.name}</h6>

              <div className="small text-muted mb-2">
                Status: <span className="fw-semibold">{lead.status}</span>
              </div>

              <div className="d-flex justify-content-between small mb-3">
                <span>Priority</span>
                <span className="fw-semibold">{lead.priority}</span>
              </div>

              <div className="d-flex justify-content-between small mb-3">
                <span>Time to close</span>
                <span>{lead.timeToClose} days</span>
              </div>

              <Link
                to={`/leadManagement/${lead._id}`}
                className="btn btn-outline-dark btn-sm mt-auto"
              >
                View Lead
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= AGENT SECTION ================= */

function AgentSection({ agentName, leadData }) {
  const [status, setStatus] = useState("");
  const [sortType, setSortType] = useState("");

  const priorityRank = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const agentLeads = useMemo(() => {
    return leadData
      .filter(
        (lead) =>
          lead.salesAgent?.name === agentName &&
          (!status || lead.status === status)
      )
      .sort((a, b) => {
        if (sortType === "priority") {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        if (sortType === "timeToClose") {
          return a.timeToClose - b.timeToClose;
        }
        return 0;
      });
  }, [leadData, agentName, status, sortType]);

  return (
    <section className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">{agentName}</h4>
          <span className="badge bg-dark">
            {agentLeads.length} Leads
          </span>
        </div>

        <AgentFilters status={status} setStatus={setStatus} />
        <AgentSortControls setSortType={setSortType} />
        <AgentLeadList leads={agentLeads} />
      </div>
    </section>
  );
}

/* ================= MAIN ================= */

export default function SalesAgentView() {
  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;
  const { leadData } = useLeadContext();

  const urlAgents = "https://crm-backend-pi-six.vercel.app/api/agents";
  const { data: agentsRes, loading } = useFetch(urlAgents, {
    allAgents: [],
  });

  if (loading) return <p>Loading agents...</p>;

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <aside>
        <Sidebar />
      </aside>
      
    <main 
      className="bg-light main-content"
    >
      <MobileSidebar />
      <h2 className="fw-bold mb-4"> Leads by Sales Agent View</h2>

        {agentsRes.allAgents.map((agent) => (
          <AgentSection
            key={agent._id}
            agentName={agent.name}
            leadData={leadData}
          />
        ))}
    </main>
      
    <footer>
        <Footer />
    </footer>
      
    </div>
  );
}
