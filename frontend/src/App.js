import React, { useContext } from 'react';
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

  return (
    <div className="h-[calc(100vh-5rem)]">
      {/* site header */}
      <div className="hidden md:flex flex-row h-20 py-3 border-b border-b-dk-border-gray">
        {accountContext.account ?
          <div className="flex w-1/4 my-auto text-4xl font-sans px-5">
            Hi <img src={accountContext.avatar} className="w-10 h-10" alt="logo" /> !
          </div> :
          <div className="flex w-1/4 mr-au my-auto text-4xl font-sans px-5"/>
        }
        <Link className="mx-auto w-14 h-14" to={'/'}>
          <img src={logo} alt="logo" />
        </Link>
        <div className="w-1/4"/>
      </div>
      <Nav className="flex flex-row justify-center md:hidden m-2"/>

      {/* main content */}
      <div className="text-center flex flex-row h-full">

        {/* left sidebar */}
        <div className="hidden md:flex md:flex-col w-1/4 max-w-3xl border-r p-5 border-r-dk-border-gray">
          <Nav />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/:publicKey" element={<Users />} />
        </Routes>

        {/* right sidebar */}
        <div className="hidden md:flex md:flex-col w-1/4 max-w-3xl border-l p-5 border-l-dk-border-gray">
          <FollowingSideBar />
        </div>
      </div>
    </div>
  );
}

export default App;
