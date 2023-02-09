import { useEffect, useContext } from "react";

function PostEditor(props) {

  useEffect(() => {

  }, []);

  return (
    props.account ?
    <div className="w-full p-3 flex flex-row border-b border-b-dk-border-gray">
        <img src={'avatar'} className="w-12 h-12 my-auto border border-dk-border-gray rounded-full" alt={`${props.account}'s avatar`} />
        <textarea className="w-full p-3 h-20 max-h-50 ml-3 resize-y text-lg font-semibold font-sans border border-dk-border-gray rounded-md" placeholder="What's happening?" />
    </div> :
    <></>
  );
}

export default PostEditor;
