export default function MobileLeadStatusSummary({ filterFunction }) {
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <div className="d-lg-none mb-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Lead Status</h6>
          {statuses.map((status) => (
            <div
              key={status}
              className="d-flex justify-content-between align-items-center py-2 border-bottom"
            >
              <span className="small text-muted">{status}</span>
              <span className="fw-bold">{filterFunction(status)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
