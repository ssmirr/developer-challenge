import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

import logo from './logo.svg';
import './App.css';

import Nav from './components/nav';
import FollowingSideBar from './components/followingSideBar';
import Home from './pages/home';
import Feed from './pages/feed';

function App() {
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    const svg = createAvatar(avataaars, { seed: randomString()}).toDataUriSync();
    setAvatar(svg);
  }, []);

  function randomString() {
    return Math.random().toString(36).slice(2, 10);
  }

  return (
    <div className="h-screen">
      {/* site header */}
      <div className="flex flex-row py-3 border-b border-b-dk-border-gray">
        {avatar && 
          <div className="flex w-1/4 mr-au my-auto text-4xl font-sans px-5">
            Hi <img src={avatar} className="w-10 h-10" alt="logo" /> !
          </div>
        }
        <Link className="mx-auto w-14 h-14" to={'/'}>
          <img src={logo} alt="logo" />
        </Link>
        <div className="w-1/4"></div>
      </div>

      {/* main content */}
      <div className="App flex flex-row h-full">

        {/* left sidebar */}
        <div className="flex flex-col w-1/4 border-r p-5 border-r-dk-border-gray">
          <Nav />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>

        {/* right sidebar */}
        <div className="flex flex-col w-1/4 border-l p-5 border-l-dk-border-gray">
          <FollowingSideBar />
        </div>
      </div>
    </div>
  );
}

export default App;
