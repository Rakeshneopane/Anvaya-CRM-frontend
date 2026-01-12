import { useEffect, useState } from "react";

import Navbar from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileSidebar from "../components/MobileSidebar";

/* ================= FORM STATUS ================= */

function FormStatus({ error, success }) {
  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        An error occurred while creating the agent.
      </div>
    );
  }

  if (success) {
    return (
      <div className="alert alert-success mt-3">
        Agent created successfully.
      </div>
    );
  }

  return null;
}

/* ================= AGENT FORM ================= */

function AgentForm({ formData, setFormData, onSubmit, fetching }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label">Agent Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter agent name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-control"
          placeholder="agent@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-dark w-100"
        disabled={fetching}
      >
        {fetching ? "Creating Agent..." : "Create Agent"}
      </button>
    </form>
  );
}

/* ================= MAIN ================= */

export default function NewSalesAgent() {
  
  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);

  const urlAgent = "http://localhost:3000/api/agents";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFetching(true);
      setError(false);

      const response = await fetch(urlAgent, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError(true);
        setFetching(false);
        return;
      }

      await response.json();

      setFormData({ name: "", email: "" });
      setSuccess(true);
      setFetching(false);
    } catch (err) {
      setError(true);
      setFetching(false);
    }
  };

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => setSuccess(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

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
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="fw-bold mb-1">Add New Sales Agent</h4>
                <p className="text-muted mb-3">
                  Create and manage your sales team
                </p>

                <AgentForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  fetching={fetching}
                />

                <FormStatus error={error} success={success} />
              </div>
            </div>
          </div>
        </div>
      </main> 
      <Footer />     
    </div>
  );
}
