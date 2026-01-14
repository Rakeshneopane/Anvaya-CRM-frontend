import { useEffect, useRef } from "react";
import { useLeadContext } from "../contexts/leadContext";
import Chart from "chart.js/auto";

import Navbar from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/footer";
import MobileSidebar from "../components/MobileSidebar";

/* ================= COLORS ================= */

const CHART_COLORS = [
  "#4f46e5", 
  "#22c55e", 
  "#f97316", 
  "#ef4444", 
  "#06b6d4", 
  "#a855f7", 
];

/* ================= CHART CARD ================= */

function ChartCard({ title, children }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h6 className="fw-bold mb-3">{title}</h6>
        {children}
      </div>
    </div>
  );
}

/* ================= CHART ================= */

function ChartCanvas({ type, labels, data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!labels.length) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type,
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: CHART_COLORS.slice(0, labels.length),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw}`,
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [labels, data, type]);

  return <canvas ref={canvasRef} />;
}

/* ================= STATUS BREAKDOWN ================= */

function StatusBreakdown({ statusCount, total }) {
  return (
    <ChartCard title="Lead Status Breakdown">
      <div className="d-flex flex-column gap-3 mb-3">
        {Object.entries(statusCount).map(([status, count]) => {
          const percent = ((count / total) * 100).toFixed(1);
          return (
            <div key={status}>
              <div className="d-flex justify-content-between small mb-1">
                <span>{status}</span>
                <span className="fw-semibold">
                  {count} ({percent}%)
                </span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

/* ================= MAIN ================= */

export default function Reports() {
  const { leadData } = useLeadContext();

  if (!leadData || leadData.length === 0) {
    return <div>Loading...</div>;
  }

  /* ===== DERIVED DATA ===== */

  // Status distribution
  const statusCount = leadData.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Pipeline (not closed)
  const pipelineStatusCount = leadData.reduce((acc, lead) => {
    if (lead.status !== "Closed") {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
    }
    return acc;
  }, {});

  // Closed last week
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const closedLastWeek = leadData.filter(
    (lead) =>
      lead.status === "Closed" &&
      new Date(lead.updatedAt) >= sevenDaysAgo
  );

  const closedLastWeekCount = {
    Closed: closedLastWeek.length,
    Others: leadData.length - closedLastWeek.length,
  };

  // Closed by agent
  const closedByAgent = leadData.reduce((acc, lead) => {
    if (lead.status === "Closed") {
      const agent = lead.salesAgent?.name || "Unknown";
      acc[agent] = (acc[agent] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main className="bg-light main-content">
        <MobileSidebar />

        <div className="container-fluid">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Reports</h2>
            <p className="text-muted mb-0">
              Visual overview of leads and sales performance
            </p>
          </div>

          {/* ===== ROW 1 ===== */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <ChartCard title="Lead Status Distribution">
                <ChartCanvas
                  type="pie"
                  labels={Object.keys(statusCount)}
                  data={Object.values(statusCount)}
                />
              </ChartCard>
            </div>

            <div className="col-lg-6">
              <ChartCard title="Leads Closed Last Week">
                <ChartCanvas
                  type="pie"
                  labels={Object.keys(closedLastWeekCount)}
                  data={Object.values(closedLastWeekCount)}
                />
              </ChartCard>
            </div>
          </div>

          {/* ===== ROW 2 ===== */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <ChartCard title="Pipeline Leads by Status">
                <ChartCanvas
                  type="bar"
                  labels={Object.keys(pipelineStatusCount)}
                  data={Object.values(pipelineStatusCount)}
                />
              </ChartCard>
            </div>

            <div className="col-lg-6">
              <ChartCard title="Closed Leads by Sales Agent">
                <ChartCanvas
                  type="bar"
                  labels={Object.keys(closedByAgent)}
                  data={Object.values(closedByAgent)}
                />
              </ChartCard>
            </div>
          </div>

          {/* ===== STATUS BREAKDOWN ===== */}
          <StatusBreakdown
            statusCount={statusCount}
            total={leadData.length}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
