import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TbLogout, TbWallet } from 'react-icons/tb';

import { AccountContext } from '../context/AccountContext';

function Nav() {
    const accountContext = useContext(AccountContext);

    async function connectMetamask() {
        console.log('connecting metamask wallet');
        try {
            // get metamask ethereum object
            const { ethereum } = window;

            if (!ethereum) {
                alert('Get MetaMask.io to use this App!');
                return;
            }

            // get chainId
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            console.log('metamask chainId', chainId);

            // get accounts
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('metamask accounts', accounts);

            // get all users
            // const getUsers = await fetch('/api/users', {
            //     method: 'GET',
            //     headers: { 'Content-Type': 'application/json' }
            // });
            // console.log('getUsers', await getUsers.json());

            // set public key to login endpoint

            try {
                const loginResult = await fetch('/api/users/login', {
                    method: 'POST',
                    body: JSON.stringify({ publicKey: accounts[0] }),
                    headers: { 'Content-Type': 'application/json' }
                });
                // console.log('login result', await loginResult.json());

                localStorage.setItem('account', accounts[0]);
                accountContext.setAccount(accounts[0]);
            } catch (error) {
                console.error('failed to login', error);
            }
        }
        catch (error) {
            console.error(error);
        }

    }

    async function logout() {
        console.log('logging out');
        localStorage.removeItem('account');
        accountContext.setAccount(null);
        accountContext.socket.emit('logout', accountContext.account);
    }

    useEffect(() => {
        const account = localStorage.getItem('account');
        if (account) {
            accountContext.setAccount(account);
        }
    }, [accountContext]);

    return (
        <div className="flex flex-col space-y-1">
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/">
                Home
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/feed">
                Feed
            </Link>
            {accountContext.account ?
                (
                <button className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                        onClick={logout}>
                    Logout <TbLogout className="flex ml-2 my-auto" size={20} />
                </button>) : 
                (<button
                    className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                    onClick={connectMetamask}>
                    Login <TbWallet className='flex my-auto ml-2' size={20}/>
                </button>
            )}
        </div>
    );
  }
  
  export default Nav;
  