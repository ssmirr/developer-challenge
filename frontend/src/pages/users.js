import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/post';
import { AccountContext } from '../context/AccountContext';

import { TbCopy } from 'react-icons/tb';
import { SlUserFollow, SlUserUnfollow } from 'react-icons/sl';

function Users(props) {
  const accountContext = useContext(AccountContext);

  const [followed, setFollowed] = useState(false);
  const {publicKey} = useParams(); // getting the public key from the url params (see Route defined in frontend/src/App.js)
  const [posts, setPosts] = useState([]);
  const [userNotFound, setUserNotFound] = useState(false);

  async function follow() {
    try {
      const followResponse = await (await fetch('/api/users/follow', {
        method: 'POST',
        body: JSON.stringify({ followee: publicKey, follower: accountContext.account }),
        headers: { 'Content-Type': 'application/json' }
      })).json();

      if (!followResponse.error) {
        accountContext.socket.emit('unfollow', accountContext.account);
        setFollowed(true);
        accountContext.setFollowing(following => [...following, { publicKey: publicKey }])
      }
      else {
        console.error('failed to follow', followResponse.error);
      }
    } catch (error) {
      console.error('failed to follow', error);
    }
  }

  async function unfollow() {
    try {
      const unfollowResponse = await (await fetch('/api/users/unfollow', {
        method: 'POST',
        body: JSON.stringify({ followee: publicKey, follower: accountContext.account }),
        headers: { 'Content-Type': 'application/json' }
      })).json();

      if (!unfollowResponse.error) {
        accountContext.socket.emit('unfollow', accountContext.account);
        setFollowed(false);
        accountContext.setFollowing(following => following.filter(follow => follow.publicKey !== publicKey));
      }
      else {
        console.error('failed to unfollow', unfollowResponse.error);
      }
    } catch (error) {
      console.error('failed to unfollow', error);
    }
  }

  useEffect(() => {
    document.title = 'Nostr Home';

    // get posts from user (or show error if user not found)
    fetch(`/api/users/${publicKey}`)
      .then(res => res.json())
      .then(posts => {
        if (posts.error)
          setUserNotFound(true);
        else {
          if (posts.output)
            setPosts(posts.output.reverse());
          else
            setPosts([]);
        }
      })
      .catch(err => console.error('failed to get posts from user', err))
    
    // check if followed
    if (accountContext.account) {
      fetch(`/api/users/isFollowed?followee=${publicKey}&follower=${accountContext.account}`)
        .then(res => res.json())
        .then(isFollowed => {
          setFollowed(isFollowed.output);
        });
    }
  }, [publicKey, accountContext.account]);

  return (
    <div className="w-full px-5 overflow-y-auto">
      {userNotFound && <div className="border-b border-b-dk-border-gray text-dk-secondary pb-5">User not found ☠️</div>}
      {!userNotFound && 
      <div>
        <div className="border-b border-b-dk-border-gray text-dk-secondary py-5 flex">
          <div className="ml-3 my-auto">
            <span className="hidden md:inline">You are seeing posts from </span>
            {publicKey.substring(0, 10)}...
            <TbCopy className="inline ml-1 hover:text-dk-secondary-hover cursor-pointer my-auto" onClick={() => { navigator.clipboard.writeText(publicKey) }} />
          </div>
          {
            accountContext.account &&
            <button
              className={"ml-auto mr-3 text-dk-faded bg-dk-primary hover:bg-dk-primary-hover text-white font-bold py-1 px-4 rounded-full" + 
                      (accountContext.account === publicKey ? ' hover:bg-dk-secondary bg-dk-secondary active:bg-dk-secondary cursor-not-allowed' : '')}
              onClick={() => {
                if(accountContext.account === publicKey)
                  return;
                else if (followed)
                  unfollow()
                else
                  follow()
              }}
              title={accountContext.account === publicKey ? `You can't follow yourself.` : `Follow this user`}>
              {followed ?
                <>
                  Unfollow
                  <SlUserUnfollow className="inline ml-1 my-auto" />
                </>
                :
                <>
                  Follow
                  <SlUserFollow className="inline ml-1 my-auto" />
                </>
              }
            </button>
          }
        </div>
        {posts.map(post => <Post key={post.id} author={post.author} text={post.text} timestamp={post.timestamp}/>)}
      </div>}
    </div>
  );
}

export default Users;
