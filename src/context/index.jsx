import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useContractRead, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const auctionContract = useContract('0x3Be93e2743198faa0C4347f92e6A04Cd2D1E0E15');
    console.log(auctionContract.contract);

    const { mutateAsync: createAuction, isLoading2 } =
    useContractWrite(auctionContract.contract, 'createAuction');

    const address = useAddress();
    const connect = useMetamask();

    const publishAuction = async (form) => {
        try {
            const data = await createAuction({ args: [
                address,
                form.title,
                form.description,
                Math.floor( new Date(form.deadline).getTime() /1000),
                form.image,
                form.target
            ]});
            console.log("contract call success", data);
        } catch (error){
            console.log("contract call failure", error);
        }
    }

    const getAuctions = async () => {
        const auctions = await auctionContract.contract.call('getAuctions');

        const parsedAuctions = auctions.map((auction, i) => ({
            owner: auction.owner,
            title: auction.title,
            description: auction.description,
            deadline: auction.deadline.toNumber() * 1000,
            target: ethers.utils.formatEther(auction.target.toString()),
            image: auction.image,
            winner: auction.winner,
            pId: i
        }));
        return parsedAuctions
    }

    const getUserAuctions = async () => {
        const allAuctions = await getAuctions();

        const filteredAuctions = allAuctions.filter((auction) =>
            auction.owner === address);

        return filteredAuctions;
    }

    const bid = async (pId, amount) => {
        const data = await auctionContract.contract.call('bidTheAuction', [pId],
        { value: ethers.utils.parseEther(amount) });

        return data;
    }

    const getParticipants = async (pId) => {
        const participants = await auctionContract.contract.call('getParticipants', [pId]);  // follow this rules, https://portal.thirdweb.com/typescript/sdk.smartcontract.call
        const numberOfParticipants = participants.length;
        const parsedParticipants = [];

        for(let i = 0; i < numberOfParticipants; i++) {
            parsedParticipants.push({
                bidder: participants[i].bidder,
                bidRecords: ethers.utils.formatEther(participants[i].bidRecords.toString()),
                withdrawnStatus: participants[i].withdrawnStatus
            })
        }
        return parsedParticipants;
    }

    // this code must use the same validation with smartcontract function call at the usecase
    const withdrawFund = async (pId) => {
        const withdraw = await auctionContract.contract.call('withdrawFunds', [pId]);
        console.log(withdraw);
        return withdraw
    }

    return (
        <StateContext.Provider
            value={{
                address,
                connect,
                auctionContract,
                createAuction: publishAuction,
                getAuctions,
                getUserAuctions,
                bid,
                getParticipants,
                withdrawFund
            }}
        >
            {children}
        </StateContext.Provider>
    )
}



export const useStateContext = () => useContext(StateContext);
