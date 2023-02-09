import { useEffect, useContext } from "react";
import PostEditor from "../components/postEditor";
import { AccountContext } from "../context/AccountContext";

function Feed() {
  const accountContext = useContext(AccountContext);

  useEffect(() => {
    document.title = "Nostr Feed";
  }, []);

  return (
    <div className="w-full px-5 overflow-y-auto">
      <div className="mx-auto">
        {accountContext.account ?
          <div>
            <PostEditor/>
            <div className="border-b border-b-dk-border-gray text-dk-secondary py-5 select-none">
                See the latest posts from people you follow 👀
            </div>
          </div>
          :
          <div>
            <div className="border-b border-b-dk-border-gray text-dk-secondary py-5 select-none">
              Login to enjoy posts from people you follow! 💂‍♀️
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Feed;
