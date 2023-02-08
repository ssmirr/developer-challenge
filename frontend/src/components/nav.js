import { Link } from 'react-router-dom';

function Nav() {

    return (
        <div className="flex flex-col ">
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
                Logout
            </div>
        </div>
    );
  }
  
  export default Nav;
  