import { useSelector } from "react-redux";
import { getSidebarOpen, toggleSidebar } from "../../redux/toggle";
import { useAppDispatch } from "../../redux/hooks";
import { getUser } from "../../redux/user";

// {`${ sidebarState ? "M2.75 6.75h32.5 M2.75 12h32.5m-32.5 5.25h32.5": "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}`}
/**
 * Renders Nav bar Links depending on if user is logged in
 *
 * Context: 
 *  user: userContext
 * 
 * App -> Navbar -> {Link,...}
 */
function NavBar() {
  const sidebarState = useSelector(getSidebarOpen)
  const {user} = useSelector(getUser)
  const dispatch = useAppDispatch()

    return (
    <>
      <div className={`flex ${user ? "justify-between" : "justify-end"} border-b-2 px-4 py-2 h-16 items-center`}>
        { user &&
        <div onClick={() => dispatch(toggleSidebar())} className="p-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`"w-8 h-8 transition-transform delay-75 ${sidebarState ? "scale-x-110 scale-y-150 rotate-90" : "scale-x-100"}`} >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </div>
        }
        <div className="flex items-center gap-4">
         { user && <button className="btn-secondary">Logout</button>}
        <h3>Logo Placeholder</h3>
        </div>

      </div>
    </>
    )

}

export default NavBar