import { Link } from 'react-router-dom';

function Nav() {

    return (
        <div className="flex flex-col ">
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/">
                User 1
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/feed">
                User 2
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/">
                User 3
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/feed">
                User 4
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/">
                User 5
            </Link>
            <Link
                className="flex flex-row px-3 py-2 rounded border text-dk-faded bg-dk-primary hover:bg-dk-primary-hover active:bg-dk-primary cursor-pointer"
                to="/feed">
                User 6
            </Link>
        </div>
    );
  }
  
  export default Nav;
  