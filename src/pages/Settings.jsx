import Navbar from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileLeadStatusSummary from "../components/MobileStatusSummary";
import MobileSidebar from "../components/MobileSidebar";

import { useLeadContext } from "../contexts/leadContext";
import { useAgentContext } from "../contexts/agentContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

/* ================= REUSABLE CARD ================= */

function SettingsCard({ title, subtitle, actions }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h6 className="fw-bold mb-1">{title}</h6>
        {subtitle && <p className="text-muted small mb-3">{subtitle}</p>}
        <div className="mt-auto d-flex flex-column gap-2">{actions}</div>
      </div>
    </div>
  );
}

/* ================= SETTINGS PAGE ================= */

export default function Settings() {
  const { leadData, deleteEntity } = useLeadContext();
  const { agents } = useAgentContext();

  return (
    <div>
      <Navbar />
      <Sidebar />
      

      <main className="main-content">

        <MobileSidebar />

        <h1 className="fw-bold mb-2">Settings</h1>
        <p className="text-muted mb-4">
          Manage and delete entities. These actions are permanent.
        </p>

        {/* ================= LEADS ================= */}
        <section className="mb-5">
          <h4 className="fw-bold mb-3">Leads</h4>

          <div className="row g-3">
            {leadData.length === 0 && (
              <p className="text-muted">No leads found.</p>
            )}

            {leadData.map((lead) => (
              <div key={lead._id} className="col-md-6 col-lg-4">
                <SettingsCard
                  title={lead.name}
                  subtitle={`Status: ${lead.status}`}
                  actions={
                    <>
                      <Link
                        to={`/leadManagement/${lead._id}`}
                        className="btn btn-outline-dark btn-sm"
                      >
                        View
                      </Link>

                      <Link
                        to={`/editLead/${lead._id}`}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          deleteEntity({
                            type: "lead",
                            url: `https://crm-backend-pi-six.vercel.app/api/lead/${lead._id}`,
                            onSuccess: () =>
                              toast.success("Lead deleted"),
                            onError: (e) =>
                              toast.error(e.message),
                          })
                        }
                      >
                        Delete
                      </button>
                    </>
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================= AGENTS ================= */}
        <section className="mb-5">
          <h4 className="fw-bold mb-3">Sales Agents</h4>

          <div className="row g-3">
            {agents.length === 0 && (
              <p className="text-muted">No agents found.</p>
            )}

            {agents.map((agent) => (
              <div key={agent._id} className="col-md-6 col-lg-4">
                <SettingsCard
                  title={agent.name}
                  subtitle={agent.email}
                  actions={
                    <>
                      <Link
                        to={`/SalesAgentView/${agent._id}`}
                        className="btn btn-outline-dark btn-sm"
                      >
                        View
                      </Link>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          deleteEntity({
                            type: "agent",
                            url: `https://crm-backend-pi-six.vercel.app/api/agents/${agent._id}`,
                            onSuccess: () =>
                              toast.success("Agent deleted"),
                            onError: (e) =>
                              toast.error(e.message),
                          })
                        }
                      >
                        Delete
                      </button>
                    </>
                  }
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
