import { useState } from "react";
import {
  useReadContracts,
  useConnect,
  useAccount,
  useDisconnect,
  useEnsName,
  useEnsAvatar,
} from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Wallet, CoinsIcon, Power, Trash2 } from "lucide-react";
import { normalize } from "viem/ens";

const erc20ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

function isValidEthereumAddress(address: string): address is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
        >
          Connect {connector.name}
        </Button>
      ))}
    </div>
  );
}

function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: normalize("wevm.eth") });

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        {ensAvatar && (
          <img
            alt="ENS Avatar"
            src={ensAvatar}
            className="w-10 h-10 rounded-full mr-4"
          />
        )}
        <div>
          {address && (
            <div className="font-medium">
              {ensName ? `${ensName} (${address})` : address}
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={() => disconnect()}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <Power className="mr-2 h-4 w-4" /> Disconnect
      </Button>
    </div>
  );
}

export default function WalletConnectedNFTViewer() {
  const [addresses, setAddresses] = useState<`0x${string}`[]>([]);
  const [newAddress, setNewAddress] = useState("");

  const { isConnected } = useAccount();

  const { data, isLoading, isError } = useReadContracts({
    contracts: addresses.flatMap((address) => [
      {
        address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address,
        abi: erc20ABI,
        functionName: "totalSupply",
      },
    ]),
    query: {
      enabled: addresses.length > 0 && isConnected,
      refetchInterval: 10000,
    },
  });

  const handleAddAddress = () => {
    if (
      newAddress &&
      !addresses.includes(newAddress as `0x${string}`) &&
      isValidEthereumAddress(newAddress)
    ) {
      setAddresses([...addresses, newAddress as `0x${string}`]);
      setNewAddress("");
    } else {
      alert("Please enter a valid Ethereum address starting with 0x");
    }
  };

  const handleDeleteAddress = (addressToDelete: `0x${string}`) => {
    setAddresses(addresses.filter((address) => address !== addressToDelete));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddAddress();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-4 sm:p-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800"
        >
          Connector ETH
        </motion.h1>

        {isConnected ? (
          <>
            <Account />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8 mt-8"
            >
              <Input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter contract address (0x...)"
                className="flex-grow bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-lg shadow-sm"
                aria-label="Enter contract address"
              />
              <Button
                onClick={handleAddAddress}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                aria-label="Add Contract"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Contract
              </Button>
            </motion.div>

            <AnimatePresence>
              {isLoading && addresses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center my-8"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  <span className="sr-only">Loading contract data...</span>
                </motion.div>
              )}
            </AnimatePresence>
            {isError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-red-600 text-center mb-8"
                role="alert"
              >
                Error fetching contract data
              </motion.p>
            )}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {addresses.map((address, index) => (
                  <motion.div
                    key={address}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white border-none rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                      <CardHeader className="bg-blue-600 p-4 flex justify-between items-center">
                        <CardTitle className="text-lg font-bold text-white">
                          Contract {index + 1}
                        </CardTitle>
                        <Button
                          onClick={() => handleDeleteAddress(address)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                          aria-label={`Delete Contract ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-4 break-all">
                            {address}
                          </p>
                          <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 flex items-center">
                                <Wallet
                                  className="mr-2 h-5 w-5 text-blue-600"
                                  aria-hidden="true"
                                />{" "}
                                Balance:
                              </span>
                              <span className="font-mono text-gray-800">
                                {data?.[index * 2]?.result?.toString() ?? "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 flex items-center">
                                <CoinsIcon
                                  className="mr-2 h-5 w-5 text-blue-600"
                                  aria-hidden="true"
                                />{" "}
                                Total Supply:
                              </span>
                              <span className="font-mono text-gray-800">
                                {data?.[index * 2 + 1]?.result?.toString() ??
                                  "N/A"}
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <WalletOptions />
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
