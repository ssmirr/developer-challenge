import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Nav from './components/nav';
import FollowingSideBar from './components/followingSideBar';
import Home from './pages/home';
import Feed from './pages/feed';

function App() {

  return (
    <div className="flex flex-col bg-dk-background-gray">
      <Link to={'/'}>
        <img src={logo} className="w-14 h-14 mx-auto mt-3 mb-10" alt="logo" />
      </Link>
      <div className="App flex flex-row h-screen">

        {/* left sidebar */}
        <div className="flex flex-col w-1/4 border-r px-5 border-r-dk-border-gray">
          <Nav />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>

        {/* right sidebar */}
        <div className="flex flex-col w-1/4 border-l px-5 border-l-dk-border-gray">
          <FollowingSideBar />
        </div>
      </div>
    </div>
  );
}

export default App;
