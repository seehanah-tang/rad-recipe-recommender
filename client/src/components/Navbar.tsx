import '../styles/Navbar.css';
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <ul>
            <li><Link to={`/`}>Home</Link></li>
            <li><Link to={'/search'}>Search</Link></li>
            <li><Link to={'/gallery'}> Gallery </Link></li>
            <li><Link to={'/friends'}> Friends </Link></li>
        </ul>
    );
  }
  
  export default Navbar;