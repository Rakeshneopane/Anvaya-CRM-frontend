import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeadContext } from "../contexts/leadContext";
import Navbar from "../components/Header"
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileSidebar from "../components/MobileSidebar";

/* ================= SIDEBAR ================= */

// function Sidebar() {
//   return (
//     <aside>
//       <h2>Sidebar</h2>
//       <ul>
//         <Link to="/">
//           <li>Back to Dashboard</li>
//         </Link>
//       </ul>
//     </aside>
//   );
// }

/* ================= LEAD OVERVIEW ================= */

function LeadOverview({ leads }) {
  if (leads.length === 0) return <p>No leads found.</p>;

  return (
    <div className="row g-3 mb-3">
      {leads.map((lead, index) => (
        <div key={lead._id} className=" col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="fw-bold"> #{index + 1} {lead.name} </p>
              <div className="list-group list-group-flush">
                <p className="list-group-item"> <span className="text-muted"> Status: </span>  {lead.status}</p>
                <p className="list-group-item"> <span className="text-muted"> Sales agent: </span>  {lead.salesAgent?.name}</p>
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
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Filters</h6>
        
        {/* Status Filter */}
        <div className="mb-3">
          <div className="small text-muted mb-2">Status</div>
          <div className="btn-group btn-group-sm felx-wrap">
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

// function Filters({ quickFilter, setQuickFilter, agents }) {
//   const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

//   return (
//     <div>
//       <h4>Filters</h4>

//       {/* Status Filter */}
//       <div>
//         <strong>Status:</strong>{" "}
//         {statuses.map((status) => (
//           <button
//             key={status}
//             onClick={() =>
//               setQuickFilter({ ...quickFilter, status })
//             }
//           >
//             {status}
//           </button>
//         ))}
//         <button
//           onClick={() =>
//             setQuickFilter({ ...quickFilter, status: "" })
//           }
//         >
//           All
//         </button>
//       </div>

//       {/* Sales Agent Filter */}
//       <div>
//         <strong>Sales Agent:</strong>{" "}
//         <button
//           onClick={() =>
//             setQuickFilter({ ...quickFilter, salesAgent: "" })
//           }
//         >
//           All Agents
//         </button>

//         {agents.map((agent) => (
//           <button
//             key={agent}
//             value={agent}
//             onClick={(e) =>
//               setQuickFilter({
//                 ...quickFilter,
//                 salesAgent: e.target.value,
//               })
//             }
//           >
//             {agent}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

/* ================= SORT CONTROLS ================= */

// function SortControls({ setSortType }) {
//   return (
//     <div>
//       <h4>Sort By</h4>
//       <button onClick={() => setSortType("priority")}>
//         Priority
//       </button>
//       <button onClick={() => setSortType("timeToClose")}>
//         Time to close
//       </button>
//       <button onClick={() => setSortType("")}>
//         Clear Sort
//       </button>
//     </div>
//   );
// }
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
/* ================= MAIN PAGE ================= */

export default function LeadListPage() {
  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;
  // const RIGHT_PANEL_WIDTH = 260;
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
    <div>
      <header>
        <Navbar />
      </header>
      <aside>
        <Sidebar />
      </aside>
      <main
        className="main-content"
      >
        <MobileSidebar />
        <h1 className="fw-bold mb-3">Lead List</h1>
        <section>
            <p className="text-muted">Lead Overview</p>
            <LeadOverview leads={processedLead} />
          </section>

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
            <Link 
              to="/newLead" 
              className="btn btn-dark my-4" 
              style={{width: "100%"}}
            >
              Add New Lead
            </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
