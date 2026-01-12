import { useEffect, useRef } from "react";
import { useLeadContext } from "../contexts/leadContext";
import Chart from "chart.js/auto";
import { Link } from "react-router-dom";

import Navbar from "../components/Header";
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

/* ================= CHARTS SECTION ================= */

function ChartsSection({ statusCount, agentCount, leadData }) {
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    if (!leadData || leadData.length === 0) return;

    // destroy previous charts
    pieChartRef.current?.destroy();
    barChartRef.current?.destroy();

    const colors = Object.keys(statusCount).map(
                    () => `hsl(${Math.random() * 360}, 70%, 60%)`
                  )
    pieChartRef.current = new Chart(pieRef.current, {
      type: "pie",
      data: {
        labels: Object.keys(statusCount),
        datasets: [
          {
            data: Object.values(statusCount),
            backgroundColor: colors,
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });

    barChartRef.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(agentCount),
        datasets: [
          {
            data: Object.values(agentCount),
            backgroundColor: "rgba(18, 103, 173, 0.7)", 
            // Object.keys(agentCount).map(
            //   () => `hsl(${Math.random() * 360}, 70%, 60%)`
            // ),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      pieChartRef.current?.destroy();
      barChartRef.current?.destroy();
    };
  }, [statusCount, agentCount, leadData]);

  return (
    <div className="row g-4 mb-4">
      <div className="col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Leads by Status</h6>
            <canvas ref={pieRef} />
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Leads by Sales Agent</h6>
            <canvas ref={barRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STATUS BREAKDOWN ================= */

function StatusBreakdown({ statusCount, totalLeads }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Lead Status Breakdown</h6>

        <div className="d-flex flex-column gap-3">
          {Object.entries(statusCount).map(([status, count]) => {
            const percentage = ((count / totalLeads) * 100).toFixed(1);

            return (
              <div key={status}>
                <div className="d-flex justify-content-between small mb-1">
                  <span>{status}</span>
                  <span className="fw-semibold">
                    {count} ({percentage}%)
                  </span>
                </div>

                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function Reports() {
  const { leadData } = useLeadContext();

  const statusCount = (leadData ?? []).reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const agentCount = (leadData ?? []).reduce((acc, curr) => {
    const agentName = curr.salesAgent?.name || "Unknown";
    acc[agentName] = (acc[agentName] || 0) + 1;
    return acc;
  }, {});

  if (!leadData || leadData.length === 0) {
    return <div>Loading...</div>;
  }

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
            <div className="mb-4">
              <h2 className="fw-bold mb-1">Reports</h2>
              <p className="text-muted mb-0">
                Visual overview of leads and sales performance
              </p>
            </div>

            <ChartsSection
              statusCount={statusCount}
              agentCount={agentCount}
              leadData={leadData}
            />

            <StatusBreakdown
              statusCount={statusCount}
              totalLeads={leadData.length}
            />
        </div>        
      </main>
      <Footer />
    </div>
  );
}
