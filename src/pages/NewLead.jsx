import { useEffect, useState } from "react";
import { useFetch } from "../useFetch";
import { Link, useParams } from "react-router-dom";

import { toast } from "react-hot-toast"; 
import { useLeadContext } from "../contexts/leadContext";
import { useAgentContext } from "../contexts/agentContext";

import Navbar from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileSidebar from "../components/MobileSidebar";

import { useAuthFetch } from "../utils/useAuthFetch";
/* ================= SALES AGENT SELECT ================= */

function SalesAgentSelect({ agents, value, onChange }) {
  if (agents.length === 0) {
    return (
      <Link to="/addNewSalesAgent"  className="form-control p-0 m-0">
        <button className="btn btn-link text-decoration-none text-reset" > Add a new Sales Agent </button>
      </Link>
    );
  }

  return (
    <select 
      className="form-select"
      value={value} 
      onChange={onChange} 
      required
    >
      <option value="">Select Agent</option>
      {agents.map((a) => (
        <option key={a._id} value={a._id}>
          {a.name}
        </option>
      ))}
    </select>
  );
}

/* ================= TAGS SELECT ================= */

function TagsSelect({ tags, value, onChange }) {
  if (tags.length === 0) return null;

  return (
    <select 
      className="form-select"
      value={value} 
      onChange={onChange} 
      required
    >
      <option value="">Select Tags</option>
      {tags.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}

/* ================= FORM FIELDS ================= */

function LeadFormFields({ formData, setFormData, agents, tags }) {
  return (
    <div className="row g-3">
      {/* Lead Name */}
      <div className="col-12">
        <label className="form-label">Lead Name</label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      {/* Lead Source */}
      <div className="col-md-6">
        <label className="form-label">Lead Source</label>
        <select
          className="form-select"
          value={formData.source}
          onChange={(e) =>
            setFormData({ ...formData, source: e.target.value })
          }
          required
        >
          <option value="">Select Source</option>
          <option>Website</option>
          <option>Referral</option>
          <option>Cold Call</option>
          <option>Email</option>
          <option>Advertisement</option>
          <option>Other</option>
        </select>
      </div>

      {/* Sales Agent */}
      <div className="col-md-6">
        <label className="form-label">Sales Agent</label>
        <SalesAgentSelect
          agents={agents}
          value={formData.salesAgent}
          onChange={(e) =>
            setFormData({ ...formData, salesAgent: e.target.value })
          }
        />
      </div>

      {/* Status */}
      <div className="col-md-6">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          required
        >
          <option value="">Select Status</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Proposal Sent</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Priority */}
      <div className="col-md-6">
        <label className="form-label">Priority</label>
        <select
          className="form-select"
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
          required
        >
          <option value="">Select Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Time to Close */}
      <div className="col-md-6">
        <label className="form-label">Time to Close (days)</label>
        <input
          type="number"
          className="form-control"
          value={formData.timeToClose}
          onChange={(e) =>
            setFormData({ ...formData, timeToClose: e.target.value })
          }
          required
        />
      </div>

      {/* Tags */}
      <div className="col-md-6">
        <label className="form-label">Tags</label>
        <TagsSelect
          tags={tags}
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
        />
      </div>
    </div>
  );
}


/* ================= FORM STATUS ================= */

function FormStatus({ success, error, isEditMode }) {
  if (success) {
    return (
      <span className="text-success">
        {isEditMode
          ? "Lead updated successfully"
          : "Lead created successfully"}
      </span>
    );
  }

  if (error) {
    return (
      <span className="text-danger">
        Error saving lead. Try again.
      </span>
    );
  }

  return null;
}


/* ================= MAIN ================= */

export default function NewLead() {

  const authFetch = useAuthFetch();

  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;
  
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    priority: "",
    timeToClose: 0,
    tags: "",
  });

  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);

  const { leadId } = useParams();
  const isEditMode = !!leadId;

  const { refetchLeads } = useLeadContext();

  const { agents } = useAgentContext();

  const { data: tagsFetch } = useFetch(
    "https://crm-backend-pi-six.vercel.app/api/tags",
    { allTags: [] }
  );
  const tags = tagsFetch?.allTags || [];

  const leadUrl = isEditMode
    ? `https://crm-backend-pi-six.vercel.app/api/lead/${leadId}`
    : null;

  const { data: leadFetch } = useFetch(leadUrl, {});
  const leadToEdit = leadFetch?.lead;

  useEffect(() => {
    if (!isEditMode || !leadToEdit) return;

    setFormData({
      name: leadToEdit.name,
      source: leadToEdit.source,
      salesAgent: leadToEdit.salesAgent?._id ?? "",
      status: leadToEdit.status,
      priority: leadToEdit.priority,
      timeToClose: leadToEdit.timeToClose,
      tags: Array.isArray(leadToEdit.tags)
        ? leadToEdit.tags[0]?._id ?? ""
        : leadToEdit.tags?._id ?? "",
    });
  }, [leadToEdit, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setFetching(true);

    try {
      
      const url = isEditMode
        ? `https://crm-backend-pi-six.vercel.app/api/lead/${leadId}`
        : `https://crm-backend-pi-six.vercel.app/api/lead`;
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Request failed");

      await response.json();

      if (!isEditMode) {
        setFormData({
          name: "",
          source: "",
          salesAgent: "",
          status: "",
          priority: "",
          timeToClose: 0,
          tags: "",
        });
      }
      toast.success(isEditMode ? "Lead updated successfully" : "Lead added successfully");
      refetchLeads();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch(err) {
      console.error(err, err.message);
      setError(true);
    } finally {
      setFetching(false);
    }
  };

  return (
  < div className="page-wrapper">
    {/* Sidebar (fixed width column) */}
    <Sidebar />

    {/* Right content column */}
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main
        className="main-content"
      >
        <MobileSidebar />
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold mb-3">
                    {isEditMode ? "Edit Lead" : "Add New Lead"}
                  </h4>

                  <form onSubmit={handleSubmit}>
                    <LeadFormFields
                      formData={formData}
                      setFormData={setFormData}
                      agents={agents}
                      tags={tags}
                    />

                    <div className="mt-4 d-flex align-items-center gap-3">
                      <button
                        type="submit"
                        className="btn btn-dark"
                        disabled={fetching}
                      >
                        {fetching
                          ? "Saving..."
                          : isEditMode
                          ? "Update Lead"
                          : "Create Lead"}
                      </button>

                      <FormStatus
                        success={success}
                        error={error}
                        isEditMode={isEditMode}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer sticks naturally */}
      <Footer />
  </div>
);

}
