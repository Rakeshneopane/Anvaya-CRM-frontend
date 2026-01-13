import { NavLink } from "react-router-dom";

export default function MobileSidebar() {
  return (
    <div className="d-lg-none mb-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Navigation</h6>
          <ul className="nav nav-pills flex-column gap-2">
            {[
              ["Dashboard", "/"],
              ["Leads by Status", "/leadsByStatus"],
              ["Sales Lead List", "/leadList"],
              ["Sales Agent View", "/SalesAgentView"],
              ["Reports", "/reports"],
              ["Sales Management", "/SalesManagement"],
              ["Settings", "/settings"],
            ].map(([label, path]) => (
              <li key={path} className="nav-item">
                <NavLink to={path} className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "bg-dark text-white fw-bold"
                      : "text-dark"
                  }`
                }>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
