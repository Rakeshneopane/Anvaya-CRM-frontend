import { Link } from "react-router-dom";
import { useFetch } from "../useFetch";
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
//         <li>
//           <Link to="/">Back to Dashboard</Link>
//         </li>
//       </ul>
//     </aside>
//   );
// }

/* ================= SALES AGENT LIST ================= */

function SalesAgentList({ agents,leads }) {
  if (!agents || agents.length === 0) {
    return <p className="text-muted">No sales agents found.</p>;
  }

  return (
    <div className="row g-3">
      {agents.map((agent) => {
        const leadCount = leads.filter(
          (lead) => lead.salesAgent?.name === agent.name
        ).length;

        return (
          <div key={agent._id} className="col-md-6 col-xl-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold mb-1">{agent.name}</h6>
                <p className="small text-muted mb-3">{agent.email}</p>

                {/* Stats */}
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center bg-light rounded p-2">
                    <span className="small text-muted">
                      Leads Assigned
                    </span>
                    <span className="fw-bold fs-5">
                      {leadCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= MAIN ================= */

export default function SalesManagement() {

  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;

  const { leadData } = useLeadContext();

  const url = "http://localhost:3000/api/agents";
  const { data: salesAgents } = useFetch(url, { allAgents: [] });

  return (
    <div>
      
      <header>
        <Navbar/>
      </header>
      <aside>
        <Sidebar />
      </aside>
      

      <main
        className="bg-light main-content"
      >
        <MobileSidebar />
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Sales Agent Management</h2>
            <p className="text-muted mb-0">
              Manage your sales team and assignments
            </p>
          </div>

          <Link to="/addNewSalesAgent" className="btn btn-dark">
            + Add New Agent
          </Link>
        </div>

        {/* Sales Agents Section */}
        <section className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Sales Agents</h5>
            <SalesAgentList 
              agents={salesAgents.allAgents}
              leads={leadData}
            />
          </div>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
      
    </div>
  );
}
