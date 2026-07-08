import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../useFetch";
import { toast } from "react-hot-toast";
import { useAuthFetch } from "../utils/useAuthFetch";

const LeadContext = createContext();
export const useLeadContext = () => useContext(LeadContext);

export default function LeadProvider({ children }) {
  const url = "https://crm-backend-pi-six.vercel.app/api/leads";

  const authFetch = useAuthFetch();

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
const deleteEntityLead = async ({
    type,
    url,
    onSuccess,
    onError,
    updateState,
  }) => {
    toast(
      (t) => (
        <div>
          <p className="mb-2">
            Are you sure you want to delete this <b>{type}</b>?
          </p>

          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  const res = await authFetch(url, { method: "DELETE" });

                  if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data?.error || `Failed to delete ${type}`);
                  }

                  // optimistic update
                  updateState?.();
                  onSuccess?.();

                  setTimeout(() => refetch(), 300);
                } catch (err) {
                  console.error(err);
                  onError?.(err);
                  toast.error(err.message);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };


  return (
    <LeadContext.Provider
      value={{
        leadData,
        loading,
        error,
        refetchLeads: refetch,
        uniqueSalesAgentName,
        deleteEntityLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}
