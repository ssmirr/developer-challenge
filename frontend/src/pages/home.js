import React, { useEffect, useState, useContext, useRef } from 'react';
import Post from '../components/post';
import PostEditor from '../components/postEditor';

import { AccountContext } from '../context/AccountContext';

function App() {
  const accountContext = useContext(AccountContext);
  const [posts, setPosts] = useState([]);
  const listeningNewPostRef = useRef(false);

  useEffect(() => {
    if (accountContext.socket && !listeningNewPostRef.current) {
      listeningNewPostRef.current = true;
      accountContext.socket.on('newPost', (post) => {
        console.log('new post', post)
        setPosts(posts => [post, ...posts]);
      });
    }
  }, [accountContext.socket]);

  useEffect(() => {
    document.title = 'Nostr Home';

    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => {
        setPosts(posts.output.reverse());
      });

  }, []);

  return (
    <div className="w-full px-5 overflow-y-auto">
      {accountContext.account &&
        <PostEditor />
      }

      <div className="border-b border-b-dk-border-gray text-dk-secondary py-5 select-none">
          See what what's happening on 🌎
      </div>

      {posts.map(post => <Post key={post.id} author={post.author} text={post.text} timestamp={post.timestamp}/>)}
    </div>
  );
}

export default App;
