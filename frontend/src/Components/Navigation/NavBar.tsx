import { useSelector } from "react-redux";
import { getSidebarOpen, toggleSidebar } from "../../redux/toggle";
import { useAppDispatch } from "../../redux/hooks";
import { getUser, logoutUser } from "../../redux/user";

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
      <div className={`flex justify-between border-b-2 px-8 py-8 h-16 items-center absolute z-50 bg-light-100 w-full`}>
        <div className="flex items-center gap-4">
        { user &&
        <div onClick={() => dispatch(toggleSidebar())} className="p-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`"w-8 h-8 transition-transform delay-75 ${sidebarState ? "scale-x-110 scale-y-150 rotate-90" : "scale-x-100"}`} >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </div> 
        }
        <h1 className="text-4xl text-primary-200 font-Flegrei underline decoration-primary-300 select-none">Jot</h1>
        <img className="w-12 h-12 select-none pointer-events-none" src="/Notebook.svg" alt="Logo" />
        </div>
        <div className="flex items-center gap-4">
         { user && <button onClick={() => dispatch(logoutUser())} className="btn-secondary select-none">Logout</button>}
        </div>

      </div>
    </>
    )

}

export default NavBar