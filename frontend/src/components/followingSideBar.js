import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';

import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

function FollowingSideBar() {
  const accountContext = useContext(AccountContext);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // getting following for current user
    fetch(`/api/users/following?publicKey=${accountContext.account}`)
      .then(res => res.json())
      .then(following => {
        console.log('following', following.output);
        if (following.error) {
          console.error(following.error);
          return;
        }

        if (following.output.length > 0) {
          setFollowing(following.output);
          return;
        }
      });
  }, [accountContext.account]);

  return (
    <div className="flex flex-col space-y-1">
      {accountContext.account && <>
        <div className="text-left font-light mt-0">
          You are following :
        </div>
        {
          following.map((followee) =>
          <Link
          className="flex flex-row px-3 py-2 text-sm rounded border border-dk-border-gray text-dk-body-title bg-transparent hover:bg-dk-secondary-hover hover:text-dk-faded active:bg-dk-border-gray cursor-pointer"
          to={`/${followee.publicKey}`}>
              <img className="w-8 h-8 rounded-full" src={createAvatar(avataaars, { seed: followee.publicKey }).toDataUriSync()} alt="avatar" />
              <div className="my-auto ml-3">
                {followee.publicKey.substring(0, 8)}...
              </div>
            </Link>
          )
        }
      </>}
    </div>
  );
}

export default FollowingSideBar;
