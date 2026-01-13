import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
  const NAVBAR_HEIGHT = 64;
  return (
    <aside 
      className="bg-light position-fixed start-0 p-3 overflow-y-auto d-none d-lg-block"
      style={{ 
        top: `${NAVBAR_HEIGHT}px`,
        width: "220px",
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`
      }}
      >
      <ul className="nav nav-pills flex-column gap-2 text-center">
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
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "bg-dark text-white fw-bold"
                      : "text-dark"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
      </ul>
    </aside>
  );
}