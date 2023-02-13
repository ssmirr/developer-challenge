import React, { createContext, useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

// create context
const AccountContext = createContext();

const AccountContextProvider = ({ children }) => {
  // the value that will be given to the context
  const [account, setAccount] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [following, setFollowing] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const account = localStorage.getItem("account");
    if (account) {
      setAccount(account);
      setAvatar(createAvatar(avataaars, { seed: account }).toDataUriSync());
    }

  }, [account]);

  useEffect(() => {
    if (!socket) {
      const socketConn = io("http://localhost:4000", { transports: ['websocket'] });
      setSocket(socketConn);
    }
  }, [socket]);

  useEffect(() => {
    if (account && socket) {
      console.log('login', account);
      socket.emit('login', account);
    }
  }, [account, socket]);

  return (
    // the Provider gives access to the context to its children
    <AccountContext.Provider value={{ account, avatar, setAccount, following, setFollowing, socket }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
