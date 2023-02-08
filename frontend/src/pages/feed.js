
function Feed(props) {

  return (
    <div className="w-full flex flex-col">
      <div className="mx-auto">
        {props.account ?
          <div>
            here are all the posts from people you follow!
          </div>
          :
          <div>
            Login to enjoy posts from people you follow!
          </div>
        }
      </div>
    </div>
  );
}

export default Feed;
