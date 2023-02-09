import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/post';
import { AccountContext } from '../context/AccountContext';

import { TbCopy } from 'react-icons/tb';
import { SlUserFollow } from 'react-icons/sl';

function Users(props) {
  const accountContext = useContext(AccountContext);

  const [followed, setFollowed] = useState(false);
  const {publicKey} = useParams(); // getting the public key from the url params (see Route defined in frontend/src/App.js)
  const [posts, setPosts] = useState([]);
  const [userNotFound, setUserNotFound] = useState(false);

  async function follow() {
    console.log('follow')
    try {
      const followResponse = await (await fetch('/api/users/follow', {
        method: 'POST',
        body: JSON.stringify({ followee: publicKey, follower: accountContext.account }),
        headers: { 'Content-Type': 'application/json' }
      })).json();

      if (!followResponse.error) {
        setFollowed(true);
      }
      else {
        console.error('failed to follow', followResponse.error);
      }
    } catch (error) {
      console.error('failed to follow', error);
    }
  }

  async function unfollow() {
    console.log('unfollow')
    try {
      const unfollowResponse = await (await fetch('/api/users/unfollow', {
        method: 'POST',
        body: JSON.stringify({ followee: publicKey, follower: accountContext.account }),
        headers: { 'Content-Type': 'application/json' }
      })).json();
      console.log('unfollowResponse', unfollowResponse);

      setFollowed(false);
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
          console.log('posts', posts, publicKey)
          if (posts.output)
            setPosts(posts.output);
          else
            setPosts([]);

          // check if followed
          if (accountContext.account) {
            fetch(`/api/users/isFollowed?followee=${publicKey}&follower=${accountContext.account}`)
              .then(res => res.json())
              .then(isFollowed => {
                console.log('isFollowed', isFollowed);
                setFollowed(isFollowed.output);
              });
          }
        }
      })
      .catch(err => console.error('failed to get posts from user', err))
  }, [publicKey, accountContext.account]);

  return (
    <div className="w-full px-5 overflow-y-auto">
      {userNotFound && <div className="border-b border-b-dk-border-gray text-dk-secondary pb-5">User not found ☠️</div>}
      {!userNotFound && 
      <div>
        <div className="border-b border-b-dk-border-gray text-dk-secondary py-5 flex">
          <div className="ml-3 my-auto">
            You are seeing posts from {publicKey} 
            <TbCopy className="inline ml-1 hover:text-dk-secondary-hover cursor-pointer my-auto" onClick={() => { navigator.clipboard.writeText(publicKey) }} />
          </div>
          {
            accountContext.account && !followed &&
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
              Follow <SlUserFollow className="inline ml-1 my-auto" />
            </button>
          }
        </div>
        {posts.map(post => <Post key={post.id} author={post.author} text={post.text} timestamp={post.timestamp}/>)}
      </div>}
    </div>
  );
}

export default Users;
