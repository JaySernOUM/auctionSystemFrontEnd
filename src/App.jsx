import React from 'react'
import { Route, Routes} from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { AuctionDetails, CreateAuction, Home, Profile, IPFS } from './pages';

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-auction" element={<CreateAuction />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auction-details/:id" element={<AuctionDetails />} />
          <Route path="/ipfs" element={<IPFS />} />
        </Routes>
      </div>
    </div>
  )
}

export default App