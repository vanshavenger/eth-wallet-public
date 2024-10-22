// import { type BaseError, useReadContract } from "wagmi";
// import { ReadContractAbi } from './ReadContractAbi'
import { useEffect, useState } from "react";
import { createPublicClient, http, parseEther } from "viem";
import { mainnet } from "viem/chains";
// import { type UseReadContractReturnType } from 'wagmi'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

const wagmiAbi = [
   {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'supply', type: 'uint256' }],
  },
] as const;

export const ReadContract = () => {

  const [data, setData] = useState("")
  const [balance, setBalance] = useState("")
  
  const balanceOf = async () => {
    const data = await publicClient.readContract({
      address: '0x307bc530bCd62248618Ece453bFB9779290d154d',
      abi: wagmiAbi,
      functionName: 'balanceOf',
      args: ['0x307bc530bCd62248618Ece453bFB9779290d154d'],
    })
    setBalance(parseEther(data.toString()).toString())
  }


    const fun = async () => {
        const data = await publicClient.readContract({
            address: '0x307bc530bCd62248618Ece453bFB9779290d154d',
            abi: wagmiAbi,
            functionName: 'totalSupply',
        })
        console.log(parseEther(data.toString()))
        setData(parseEther(data.toString()).toString())
    }
  
    // const { data: balance } = useReadContract({
    //     abi: wagmiAbi,
    //     functionName: 'totalSupply',
    //     address: '0x6FF52e5d406995acF3B4a81EB27011F66Da015bA',
    // })
    
    // console.log(balance)
    // const {data: balance, error, isPending} = useReadContract({
    //     abi: ReadContractAbi,
    //     address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    //     functionName: 'totalSupply',
    // })
    // console.log(balance)

    useEffect(() => {
      fun()
      balanceOf()
    }, [])

    // if (isPending) return <div>Loading...</div>

    // if (error){
    //   console.error(error)
    //     return (
    //     <div>
    //         Error: {(error as unknown as BaseError).shortMessage || error.message}
    //     </div>
    //     )
    // }

    

  return (
    <div>{data?.toString()}
      <br />
      {balance?.toString()}
    </div>
  )
}
