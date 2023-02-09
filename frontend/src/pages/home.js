import React, { useEffect, useState } from 'react';
import Post from '../components/post';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = 'Nostr Home';

    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => {
        console.log(posts.output)
        setPosts(posts.output);
      });

  }, []);

  return (
    <div className="w-full">
      <div className="border-b border-b-dk-border-gray text-dk-secondary py-5">
          See what what's happening on 🌎
      </div>

      {posts.map(post => <Post key={post.id} author={post.author} text={post.text} timestamp={post.timestamp}/>)}
    </div>
  );
}

export default App;
