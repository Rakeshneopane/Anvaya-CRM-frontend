import { useLeadContext } from "../contexts/leadContext";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../useFetch";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Navbar from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileSidebar from "../components/MobileSidebar";


/* ================= LEAD DETAILS ================= */

function LeadDetails({ lead }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold mb-1">{lead.name}</h4>
            <p className="text-muted mb-0">
              Assigned to {lead.salesAgent?.name || "Unassigned"}
            </p>
          </div>

          <Link to={`/editLead/${lead._id}`} className="btn btn-outline-dark btn-sm">
            Edit Lead
          </Link>
        </div>

        <div className="row g-3">
          <Detail label="Source" value={lead.source} />
          <Detail label="Status" value={lead.status} />
          <Detail label="Priority" value={lead.priority} />
          <Detail label="Time to Close" value={`${lead.timeToClose} days`} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="col-md-6 col-lg-3">
      <div className="small text-muted">{label}</div>
      <div className="fw-semibold">{value}</div>
    </div>
  );
}


/* ================= COMMENTS LIST ================= */

function CommentsList({ comments, onDelete }) {
  if (!comments || comments.length === 0) {
    return <p className="text-muted">No comments added yet.</p>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {comments.map((c) => (
        <div key={c._id} className="border rounded p-3 bg-light">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="small fw-bold mb-1">
                {c.author?.name || "Unknown"}
              </div>
              <div className="small text-muted mb-2">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(c)}
            >
              Delete
            </button>
          </div>

          <div>{c.commentText}</div>
        </div>
      ))}
    </div>
  );
}

/* ================= ADD COMMENT FORM ================= */

function AddCommentForm({
  commentInput,
  setCommentInput,
  onSubmit,
  fetching,
  success,
  error,
}) {
   return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Add Comment</h6>

        <form onSubmit={onSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            required
          />
          <button className="btn btn-dark" disabled={fetching}>
            {fetching ? "Saving..." : "Post"}
          </button>
        </form>

        {success && <div className="text-success mt-2">{success}</div>}
        {error && <div className="text-danger mt-2">Failed to add comment</div>}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function LeadManagement() {
  
  const NAVBAR_HEIGHT = 64;
  const SIDEBAR_WIDTH = 220;
  
  const { leadData, deleteEntity } = useLeadContext();
  const { leadId } = useParams();

  const leadUrl = `http://localhost:3000/api/lead/${leadId}`;
  const { data: leadFetch } = useFetch(leadUrl, {});
  const fetchedLead = leadFetch?.lead;

  const commentUrl = `http://localhost:3000/api/lead/${leadId}/comments`;
  const { data: commentFetch } = useFetch(commentUrl, {});

  const leadFromContext = leadData.find((l) => l._id === leadId);
  const lead = leadFromContext || fetchedLead;

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [success, setSuccess] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);

  /* Load comments */
  useEffect(() => {
    if (!commentFetch?.comment) return;
    setComments(commentFetch.comment);
    window.localStorage.setItem(
      "Comment",
      JSON.stringify(commentFetch.comment)
    );
  }, [commentFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lead) return;

    setFetching(true);
    setError(false);

    try {
      const payload = {
        lead: lead._id,
        author: lead.salesAgent?._id ?? lead.salesAgent,
        commentText: commentInput,
      };

      const url = `http://localhost:3000/api/lead/${lead._id}/comments`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to comment");

      const result = await response.json();

      setComments((prev) => [...prev, result.comment]);
      setCommentInput("");
      setSuccess("Commented successfully");
    } catch (err) {
      setError(true);
      setSuccess("");
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteComment = (comment) => {
    deleteEntity({
      type: "comment",
      url: `http://localhost:3000/api/lead/${lead._id}/comments/${comment._id}`,
      onSuccess: () => {
        setComments((prev) =>
          prev.filter((c) => c._id !== comment._id)
        );
        toast.success("Comment deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete comment");
      },
    });
  };

  if (!lead) return <div>Loading...</div>;

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
        <div className="container-fluid">
          <h3 className="fw-bold mb-4">Lead Management</h3>

          <LeadDetails lead={lead} />

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Comments</h5>
              <CommentsList
                comments={comments}
                onDelete={handleDeleteComment}
              />
              <AddCommentForm
                commentInput={commentInput}
                setCommentInput={setCommentInput}
                onSubmit={handleSubmit}
                fetching={fetching}
                success={success}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>   
      <Footer />   
    </div>
  );
}
