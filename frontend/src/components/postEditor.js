import { useContext, useState } from "react";
import { AccountContext } from '../context/AccountContext';

function PostEditor(props) {
  const accountContext = useContext(AccountContext);

  const [text, setText] = useState('');

  function post() {
    if (text.length === 0) return;
    console.log(accountContext.account, 'is trying to make a post:', text);
    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ text, publicKey: accountContext.account }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(post => {
        console.log('made a new post?', post);
        if (post.blockHash && !post.error)
          setText('');
      });
  }

  return (
    accountContext.account ?
      <div className="w-full p-3 flex flex-row border-b border-b-dk-border-gray relative">
        <img src={accountContext.avatar} className="w-12 h-12 my-auto border border-dk-border-gray rounded-full" alt={`${accountContext.account}'s avatar`} />
        <textarea
          className="w-full p-3 h-20 max-h-50 ml-3 resize-y text-lg font-semibold font-sans border border-dk-border-gray rounded-md"
          placeholder="What's happening?"
          onChange={(e) => { setText(e.target.value) }}
          value={text} />
        <button
          className={"absolute bottom-5 right-5 px-2 text-dk-faded bg-dk-primary rounded-md cursor-pointer hover:bg-dk-primary-hover active:bg-dk-primary" + (text.length === 0 ? " bg-dk-secondary hover:bg-dk-secondary active:bg-dk-secondary cursor-not-allowed" : "")}
          onClick={post}>Post</button>
      </div> :
      <></>
  );
}

export default PostEditor;
