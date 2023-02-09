import { useEffect, useContext, useState } from "react";
import PostEditor from "../components/postEditor";
import Post from "../components/post";
import { AccountContext } from "../context/AccountContext";

function Feed(props) {
  const accountContext = useContext(AccountContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = "Nostr Feed";

    if (!accountContext.account || posts.length > 0) {
      return;
    }

    // get following list
    fetch(`/api/users/following?publicKey=${accountContext.account}`)
      .then(res => res.json())
      .then(following => {
        // console.log('following', following.output);

        if (following.error) {
          console.error(following.error);
          return;
        }

        let postsArray = [];
        let followeePromises = [];
        // for each following, get their posts
        for (const followee of following.output) {
          followeePromises.push(
            new Promise(resolve => {
              fetch(`/api/users/${followee.publicKey}`)
                .then(res => res.json())
                .then(followeePosts => {
                  if (followeePosts.error) {
                    console.error(followeePosts.error);
                    return;
                  }
                  postsArray = [...postsArray, ...followeePosts.output]
                  resolve();
                })
            })
          );
        }

        // wait for all followee posts to be fetched
        Promise.all(followeePromises).then(() => {
          // console.log('setting posts', postsArray)
          setPosts(postsArray);
        })
      });

  }, [accountContext.account, posts.length]);

  return (
    <div className="w-full px-5 overflow-y-auto">
      <div className="mx-auto">
        {accountContext.account ?
          <div>
            <PostEditor />
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

      {posts.sort((a, b) => b.timestamp - a.timestamp).map(post => <Post key={post.id} author={post.author} text={post.text} timestamp={post.timestamp} />)}
    </div>
  );
}

export default Feed;
