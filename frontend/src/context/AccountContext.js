import React, { createContext, useState, useEffect } from "react";
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

// create context
const AccountContext = createContext();

const AccountContextProvider = ({ children }) => {
  // the value that will be given to the context
  const [account, setAccount] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const account = localStorage.getItem("account");
    if (account) {
      setAccount(account);
      setAvatar(createAvatar(avataaars, { seed: account }).toDataUriSync());
    }

  }, []);

  return (
    // the Provider gives access to the context to its children
    <AccountContext.Provider value={{account, avatar}}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
