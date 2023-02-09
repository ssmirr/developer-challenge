import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/post';

function Users() {
    // get publicKey params
  const {publicKey} = useParams()
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = 'Nostr Home';

    console.log('publicKey', publicKey)
    fetch(`/api/users/${publicKey}`)
      .then(res => res.json())
      .then(posts => {
        console.log(posts.output)
        setPosts(posts.output);
      });
  }, []);

  return (
    <div className="w-full">
      You are seeing posts from {publicKey}
      {posts.map(post => <Post key={post.id} author={post.author} text={post.text} timestamp={post.timestamp}/>)}
    </div>
  );
}

export default Users;
