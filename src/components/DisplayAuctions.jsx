import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loader } from '../assets';
import FundCard from './FundCard';

const DisplayAuctions = ({title, isLoading, auctions}) => {
    const navigate = useNavigate();

    const handleNavigate = (auction) => {
        console.log("trigger Navigate");
        navigate(`/auction-details/${auction.title}`, { state: auction })
    }

    const unixTimestamp = (dateNow) => {
        return dateNow / 1000
    }

    const activeAuction = auctions.filter((auction) => {
        return unixTimestamp(auction.deadline) > unixTimestamp(Date.now());   //check if dealine is over, no longer required to display the information
    });

    const expiredAuction = auctions.filter((auction) => {
        return unixTimestamp(auction.deadline) <= unixTimestamp(Date.now());
    });

    return (
        <div>
            <div>
                <h1 className="font-epilogue font-semibold text-[20px]
                text-white text-left pb-4">{title}</h1>
                <h1 className="font-epilogue font-semibold text-[15px]
                text-white text-left">Active Auction(s): {activeAuction.length}</h1>

                <div className="flex flex-wrap mt-[20px] gap-[26px]">
                    {isLoading && (
                        <img src={loader} alt="loader" className="w-[100px]
                        h-[100px] object-contain"/>
                    )}

                    {!isLoading && activeAuction.length === 0 && (
                        <p className="font-epilogue font-semibold text-[14px]
                        leading-[30px] text-[#818183]">
                            You have not created any auctions yet
                        </p>
                    )}

                    {!isLoading && activeAuction.length > 0 && activeAuction.map
                    ((activeAuction) => {
                        return <FundCard
                        key={activeAuction.pId}
                        {...activeAuction}
                        handlerClick={() => handleNavigate(activeAuction)}
                    />})}
                </div>
            </div>
            <div>
                <h1 className="font-epilogue font-semibold text-[15px]
                text-white text-left pt-10">Expired Auction(s): {expiredAuction.length}</h1>

                <div className="flex flex-wrap mt-[20px] gap-[26px]">
                    {isLoading && (
                        <img src={loader} alt="loader" className="w-[100px]
                        h-[100px] object-contain"/>
                    )}

                    {!isLoading && expiredAuction.length === 0 && (
                        <p className="font-epilogue font-semibold text-[14px]
                        leading-[30px] text-[#818183]">
                            You have not any expired auctions yet
                        </p>
                    )}

                    {!isLoading && expiredAuction.length > 0 && expiredAuction.map
                    ((expiredAuction) => {
                        return <FundCard
                        key={expiredAuction.pId}
                        {...expiredAuction}
                        handlerClick={() => handleNavigate(expiredAuction)}
                    />})}
                </div>
            </div>
        </div>
    )
}

export default DisplayAuctions