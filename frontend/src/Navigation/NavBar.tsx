import { useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "../userContext";


/**
 * Renders Nav bar Links depending on if user is logged in
 *
 * Context: 
 *  user: userContext
 * 
 * App -> Navbar -> {Link,...}
 */
function NavBar({ logout}: NavBarComponent) {

  const user = useContext(userContext);

  function userLoggedIn() {
    <>

    </>
  }
}

export default NavBar