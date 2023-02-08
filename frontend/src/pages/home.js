import React, { useEffect, useState } from 'react';

function App() {

  useEffect(() => {
    document.title = 'Nostr Home';

    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => console.log(posts.output));

  }, []);

  return (
    <div className="w-full">
      All the posts will be displayed here!
    </div>
  );
}

export default App;
