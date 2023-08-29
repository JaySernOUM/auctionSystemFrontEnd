import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft, timeLeft } from '../utils';
import { thirdweb } from '../assets';

const AuctionDetails = () => {
  // state variable is passed from DisplayAuction.jsx
  const { state } = useLocation();

  const navigate = useNavigate();
  const { bid, getParticipants, auctionContract, address, withdrawFund } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const [bidders, setBidders] = useState([]);
  const remainingDays = daysLeft(state.deadline);
  const remainingTimes = timeLeft(state.deadline);

  const fetchParticipants = async () => {
    const data = await getParticipants(state.pId);
    console.log(data);
    setBidders(data);
  }

  useEffect(() => {
    if(auctionContract.contract) fetchParticipants();
  }, [auctionContract.contract, address]);

  const handleBidding = async () => {
    //throw error if no amount
    try {
      if (!amount) return
      setIsLoading(true);
      await bid(state.pId, amount);
      navigate('/');
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      navigate('/');
    }
  }

  const unixTimestamp = (dateNow) => {
    return dateNow / 1000
  }

  const handleWithdraw = async () => {
    setIsLoading(true);
    await withdrawFund(state.pId);
    setIsLoading(false);
  }
  
  const highestBidRecord = bidders.reduce((highest, current) => {
    return current.bidRecords > highest.bidRecords ? current : highest;
  }, { bidRecords: 0 });
  
  const isTargetAchieve = highestBidRecord.bidRecords >= parseFloat(state.target);

  // if user participated this auction and do not has any withdrawal record and the deadline is either over or auction target is achieved
  const withdrawButtonVisible = bidders.some(
    participant => participant.bidder === address && !participant.withdrawnStatus
      && (unixTimestamp(state.deadline) < unixTimestamp(Date.now()) || 
      isTargetAchieve));

  const isWinner = (state.winner === address &&
    state.winner === highestBidRecord.bidder);
  
  const isAuctionOwner = state.owner === address;
  return (
    <div>
      {isLoading && <Loader />}
      <div className="w-full flex md:flex row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="auction"
          className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]"
            style={{ width: `${calculateBarPercentage(state.target, highestBidRecord.bidRecords)}%`
            , maxWidth: '100'}}>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title="Time Left" value={remainingTimes} />
          <CountBox title={`Current highest bid ${state.target}`} value={highestBidRecord.bidRecords} color='bg-[#eb4034]'/>
          <CountBox title={`Goal`} value= {state.target}/>
          <CountBox title="Total Participants" value={bidders.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white p-3 bg-[#1c1c24]
            rounded-t-[10px] w-full text-center uppercase">Auctioneer</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32]
              cursor pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] objec-contain"/>
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">Owner Address: {state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">Auctioneer</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white p-3 bg-[#1c1c24]
              rounded-t-[10px] w-full text-center uppercase">Product Description</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px]
                text-justify">{state.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white p-3 bg-[#1c1c24]
              rounded-t-[10px] w-full text-center uppercase">Participants</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {bidders.length > 0 ? bidders.map((item, index) => (
                  <div key={`${item.bidder}-${index}`} className="flex justify-between items-center
                  gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-11">{index + 1}. {item.bidder}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-11">{index + 1}. {item.bidRecords}</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px]
                  text-justify">No bidder yet. Be the first one</p>
                )}
              </div>
          </div>

          {((!isWinner && withdrawButtonVisible)) && (
            <div className="my-[20px] rounded-[10px]">
              <CustomButton
                btnType="button"
                title="Withdraw"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleWithdraw}
              />
            </div>
          )}

          {(isWinner && unixTimestamp(state.deadline) < unixTimestamp(Date.now()) || isTargetAchieve && isWinner) ? (
            <h4 className="font-epilogue font-semibold text-[50px] p-3 bg-[#1c1c24]
            rounded-t-[10px] w-full text-center uppercase"
            style={{
              background: 'linear-gradient(45deg, red, yellow)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            >Congratulations! You have won this auction</h4>
          ) : ((isTargetAchieve && !isWinner || unixTimestamp(state.deadline) < unixTimestamp(Date.now())) ? (
            <p className="font-epilogue text-[20px] p-3 bg-[#1c1c24]
              rounded-t-[10px] w-full text-center uppercase"
              style={{
                color:"red"
              }}
            >
              Auction is over. You didn't win this time.
            </p>
          ) : (
            <p className="font-epilogue text-[20px] p-3 bg-[#1c1c24]
              rounded-t-[10px] w-full text-center uppercase"
              style={{
                color:"green"
              }}
            >
              Auction is still ongoing. Good luck!
            </p>
          )
        )}
        </div>

        {(unixTimestamp(state.deadline) > unixTimestamp(Date.now()) && (!isTargetAchieve && !isAuctionOwner)) && (
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white p-3 bg-[#1c1c24]
                  rounded-t-[10px] w-full text-center uppercase">Bid</h4>
            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded=[10px]">
              <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Bid the auction with ETH
              </p>
              <div className="mt-[30px]">
                <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px]
                border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px]
                placeholder:text-[#4b5264] rounded-[10px]'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
                <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px]
                  text-white"> Please do not hesitate to bid and win the auction</h4>
                  <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                    Click below "Bid" button to participate!</p>
                </div>

                <CustomButton
                  btnType="button"
                  title="Bid Auction"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleBidding}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuctionDetails