import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import { DisplayAuctions } from '../components';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);

  const { address, auctionContract, getAuctions } = useStateContext();

  const fetchAuctions = async () => {
    setIsLoading(true);
    const auctionData = await getAuctions();
    setAuctions(auctionData);
    setIsLoading(false);
  }

  //useEffect unable to call await function directly
  useEffect(() => {
    if (auctionContract.contract) fetchAuctions();
  }, [auctionContract.contract, address]);

  return (
    <DisplayAuctions
      title="All Auctions"
      isLoading={isLoading}
      auctions={auctions}
    />
  )
}

export default Home