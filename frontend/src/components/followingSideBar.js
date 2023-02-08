import { Link } from 'react-router-dom';

function FollowingSideBar() {

    return (
        <div className="flex flex-col space-y-1">
            <Link
                className="flex flex-row px-3 py-2 rounded border border-dk-border-gray text-dk-body-title bg-transparent hover:bg-dk-secondary-hover hover:text-dk-faded active:bg-dk-border-gray cursor-pointer"
                to="/">
                User 1
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border border-dk-border-gray text-dk-body-title bg-transparent hover:bg-dk-secondary-hover hover:text-dk-faded active:bg-dk-border-gray cursor-pointer"
                to="/feed">
                User 2
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border border-dk-border-gray text-dk-body-title bg-transparent hover:bg-dk-secondary-hover hover:text-dk-faded active:bg-dk-border-gray cursor-pointer"
                to="/">
                User 3
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border border-dk-border-gray text-dk-body-title bg-transparent hover:bg-dk-secondary-hover hover:text-dk-faded active:bg-dk-border-gray cursor-pointer"
                to="/feed">
                User 4
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border border-dk-border-gray text-dk-body-title bg-transparent hover:bg-dk-secondary-hover hover:text-dk-faded active:bg-dk-border-gray cursor-pointer"
                to="/">
                User 5
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border border-dk-border-gray text-dk-body-title bg-transparent hover:bg-dk-secondary-hover hover:text-dk-faded active:bg-dk-border-gray cursor-pointer"
                to="/feed">
                User 6
            </Link>
        </div>
    );
  }
  
  export default FollowingSideBar;
  