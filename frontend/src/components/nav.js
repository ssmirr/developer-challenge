import { Link } from 'react-router-dom';
import { TbLogout } from 'react-icons/tb';

function Nav() {

    return (
        <div className="flex flex-col space-y-1">
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/">
                Home
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/feed">
                Feed
            </Link>
            <div className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer">
                Logout <TbLogout className="flex ml-2 my-auto" size={20} />
            </div>
        </div>
    );
  }
  
  export default Nav;
  