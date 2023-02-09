import { useEffect, useState } from "react";
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

// time ago 
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { Link } from "react-router-dom";
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

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
      <div className="ml-3 mt-2 h-10 flex flex-row">
        <Link to={`/${props.author.publicKey}`} className="flex flex-row  hover:underline">
          {/* author avatar */}
          <img src={avatar} className="w-8 h-8 my-auto border border-dk-border-gray rounded-full" alt={`${props.author.publicKey}'s avatar`} />
          {/* author short-key */}
          <div className="ml-3 my-auto text-sm font-semibold font-sans">
            {props.author.publicKey.substring(0, 8)}...
          </div>
        </Link>
        {/* time ago -- the package even has a twitter style! https://www.npmjs.com/package/javascript-time-ago#user-content-twitter */}
        <div className="ml-auto mr-3 my-auto text-sm text-dk-secondary font-sans">
          {timeAgo.format(new Date(Number(props.timestamp) * 1000), 'twitter')}
        </div>
      </div>

      {/* post content */}
      <p className="ml-3 my-3 font-sans text-left">
        {props.text}
      </p>
    </div>
  );
}

export default Post;
