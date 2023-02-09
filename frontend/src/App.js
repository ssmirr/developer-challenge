import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import { AccountContext } from './context/AccountContext';
import Nav from './components/nav';
import FollowingSideBar from './components/followingSideBar';
import Home from './pages/home';
import Feed from './pages/feed';
import Users from './pages/users';

function App() {
  const accountContext = useContext(AccountContext);
  const [account, setAccount] = useState(null);

  return (
    <>
    <div className="h-screen">
      {/* site header */}
      <div className="flex flex-row py-3 border-b border-b-dk-border-gray">
        {accountContext.account ?
          <div className="flex ml-52 w-1/4 mr-au my-auto text-4xl font-sans px-5">
            Hi <img src={accountContext.avatar} className="w-10 h-10" alt="logo" /> !
          </div> :
          <div className="flex ml-52 w-1/4 mr-au my-auto text-4xl font-sans px-5"/>
        }
        <Link className="mx-auto w-14 h-14" to={'/'}>
          <img src={logo} alt="logo" />
        </Link>
        <div className="mr-56 w-1/4"/>
      </div>

      {/* main content */}
      <div className="App flex flex-row h-full">

        {/* left sidebar */}
        <div className="flex flex-col ml-52 w-1/4 border-r p-5 border-r-dk-border-gray">
          <Nav />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/:publicKey" element={<Users account={account}/>} />
        </Routes>

        {/* right sidebar */}
        <div className="flex flex-col mr-56 w-1/4 border-l p-5 border-l-dk-border-gray">
          <FollowingSideBar />
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
