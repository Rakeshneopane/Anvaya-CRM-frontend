import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../useFetch";
import { toast } from "react-hot-toast";
import { useAuthFetch } from "../utils/useAuthFetch";

const AgentContext = createContext();
export const useAgentContext = () => useContext(AgentContext);

export default function AgentProvider({ children }) {
  const url = "https://crm-backend-pi-six.vercel.app/api/agents";
  
  const authFetch = useAuthFetch();

  // hydrate from localStorage FIRST
  const [agents, setAgents] = useState(() => {
    const cached = localStorage.getItem("localAgents");
    return cached ? JSON.parse(cached) : [];
  });

  // fetch fresh data in background
  const { data, loading, error, refetch } = useFetch(url, {
    allAgents: [],
  });

  // reconcile backend → UI
  useEffect(() => {
    if (data?.allAgents) {
      setAgents(data.allAgents);
      localStorage.setItem(
        "localAgents",
        JSON.stringify(data.allAgents)
      );
    }
  }, [data]);
  
  //delete function
  const deleteEntityAgent = async ({
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
    <AgentContext.Provider
      value={{
        agents,
        loading,
        error,
        setAgents,
        refetchAgents: refetch,
        deleteEntityAgent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
