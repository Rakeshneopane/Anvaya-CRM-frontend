import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../useFetch";

const AgentContext = createContext();
export const useAgentContext = () => useContext(AgentContext);

export default function AgentProvider({ children }) {
  const url = "http://localhost:3000/api/agents";

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

  return (
    <AgentContext.Provider
      value={{
        agents,
        loading,
        error,
        refetchAgents: refetch,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
