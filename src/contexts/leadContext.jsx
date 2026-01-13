import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../useFetch";
import { toast } from "react-hot-toast";

const LeadContext = createContext();
export const useLeadContext = () => useContext(LeadContext);

export default function LeadProvider({ children }) {
  const url = "http://localhost:3000/api/leads";

  // hydrate from localStorage FIRST
  const [leadData, setLeadData] = useState(() => {
    const cached = localStorage.getItem("localLeadData");
    return cached ? JSON.parse(cached) : [];
  });

  // fetch fresh data in background
  const { data, loading, error, refetch } = useFetch(url, { leads: [] });

  // reconcile backend → UI
  useEffect(() => {
    if (data?.leads && data.leads.length > 0) {
      setLeadData(data.leads);
      localStorage.setItem("localLeadData", JSON.stringify(data.leads));
    }
  }, [data]);

  const uniqueSalesAgentName = [
    ...new Set(
      leadData.map(lead => lead.salesAgent?.name).filter(Boolean)
    )
  ];

  // Delete function
  const deleteEntity = async ({ type, url, onSuccess, onError, updateState }) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${type}?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || `Failed to delete ${type}`);
      }

      // ✅ optimistic update
      if (typeof updateState === "function") {
        updateState();
      }

      if (typeof onSuccess === "function") {
        onSuccess();
      }

      // optional: refetch AFTER optimistic update
      setTimeout(() => refetch(), 300);

    } catch (error) {
      console.error(error);
      if (typeof onError === "function") {
        onError(error);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <LeadContext.Provider
      value={{
        leadData,
        loading,
        error,
        refetchLeads: refetch,
        uniqueSalesAgentName,
        deleteEntity,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}
