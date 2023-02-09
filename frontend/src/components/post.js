import { useEffect, useState } from "react";
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

function Post(props) {

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    document.title = "Nostr Feed";
    console.log('props=', props)
    const svg = createAvatar(avataaars, { seed: props.author.publicKey }).toDataUriSync();
    setAvatar(svg);
  }, []);

  return (
    <div className="w-full flex flex-col border-b border-b-dk-border-gray">
      {/* author info */}
      <div className="ml-3 h-10 flex flex-row">
        {/* author avatar */}
        <img src={avatar} className="w-8 h-8 my-auto" alt={`${props.author.publicKey}'s avatar`} />
        {/* author short-key */}
        <div className="ml-3 my-auto text-sm font-semibold font-sans">
          {props.author.publicKey.substring(0, 8)}...
        </div>
        {/* time (converted from props.timestamp) */}
        <div className="ml-auto mr-3 my-auto text-sm text-dk-secondary font-sans">
          {new Date(Number(props.timestamp) * 1000).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default Post;
