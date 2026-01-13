
import { useState,useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar({leads}) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isNavExpanded, setIsNavExpanded] = useState(false)
    // Live search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const q = searchQuery.toLowerCase();

        const filteredLeads = leads.filter((lead) =>
            lead.name.toLowerCase().includes(q) ||
            lead.salesAgent?.name?.toLowerCase().includes(q) ||
            lead.salesAgent?.email?.toLowerCase().includes(q)
        );

        setSearchResults(filteredLeads);
        setShowDropdown(true);
        }, [searchQuery, leads]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992 && isNavExpanded) {
            setIsNavExpanded(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
        }, [isNavExpanded]);

  return (
    <nav 
        className="navbar navbar-expand-lg px-2 bg-light shadow-sm position-fixed top-0 start-0 w-100"
        style={{height: "64px", zIndex: 1000}}
    >
        <div className="container-fluid">
             <NavLink to="/" className="navbar-brand">
                <span className="bg-dark text-light fw-bold small rounded px-3 py-2 me-2">
                        {"A"}
                </span>
                Anvaya CRM
             </NavLink>

            <button 
                className="navbar-toggler" 
                type="button" 
                aria-expanded={isNavExpanded}
                aria-controls="navbarContent"
                aria-label="Toggle navigation"
                onClick={()=>{
                    setIsNavExpanded(!isNavExpanded);
                }}
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div 
                id="navbarContent"
                className={`collapse navbar-collapse ${ 
                    isNavExpanded ? "show": ""
                }`}
                style={
                    isNavExpanded
                    ? {
                        position: "fixed",
                        top: "64px",
                        left: 0,
                        width: "100%",
                        background: "white",
                        zIndex: 999,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }
                    : undefined
                }
            >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-end px-3">
                    {/*Search Items*/}
                    <li className="nav-item me-lg-3 mb-2 mb-lg-0 position-relative w-100 w-lg-auto">
                        <input 
                            type="text" 
                            className="form-control w-100"
                            placeholder="Search agents by name or email" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            aria-label="Search agents"
                        />
                        {/* Search Results Dropdown */}
                        {showDropdown && (
                            <div
                                className="position-absolute bg-white border rounded shadow-sm mt-1 w-100"
                                style={{ zIndex: 1100, maxHeight: "300px", overflowY: "auto" }}
                            >
                                {searchResults.length > 0 ? (
                                searchResults.map((lead) => (
                                    <div
                                    key={lead._id}
                                    className="p-2 border-bottom"
                                    style={{ cursor: "pointer" }}
                                    onMouseDown={() => {
                                        navigate(`/leadManagement/${lead._id}`);
                                        setSearchQuery("");
                                        setShowDropdown(false);
                                        setIsNavExpanded(false);
                                    }}
                                    >
                                    <div className="fw-bold text-dark">{lead.name}</div>
                                    <div className="small text-muted">
                                        Assigned to {lead.salesAgent?.name || "Unassigned"}
                                    </div>
                                    </div>
                                ))
                                ) : (
                                <div className="p-2 text-muted">No leads found</div>
                                )}
                            </div>
                            )}

                    </li>
                    {/*Navigation links*/}
                    <li className="nav-item mb-2 mb-lg-0">
                        <NavLink 
                            to="/leadList" 
                            className={"nav-link"}
                            onClick={() => setIsNavExpanded(false)}
                        >
                            Leads
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2 mb-lg-0">
                        <NavLink 
                            to="/leadsByStatus"
                            className={"nav-link"}
                            onClick={() => setIsNavExpanded(false)}
                        >
                            Status
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2 mb-lg-0">
                        <NavLink 
                            to="/SalesAgentView" 
                            className={"nav-link"}
                            onClick={() => setIsNavExpanded(false)}
                        >
                            Agents
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2 mb-lg-0">
                        <NavLink 
                            to="/reports" 
                            className={"nav-link"}
                            onClick={() => setIsNavExpanded(false)}
                        >
                            Reports
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2 mb-lg-0">
                        <NavLink 
                            to="/settings" 
                            className={"nav-link"}
                            onClick={() => setIsNavExpanded(false)}
                        >
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}
