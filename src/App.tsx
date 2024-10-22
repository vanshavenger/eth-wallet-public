import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import ContractInfoViewer from "@/components/Read";
// import { ReadContract } from "./components/ReadContract";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ContractInfoViewer />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
