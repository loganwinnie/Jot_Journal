import { useSelector } from "react-redux";
import { getSidebarOpen, toggleSidebar } from "../../redux/toggle";
import { useAppDispatch } from "../../redux/hooks";
import { getUser } from "../../redux/user";
import { useGetAllEntriesQuery } from "../../api/entry";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { init } from 'emoji-mart'
import Emoji from "../Emoji.tsx";
init({ data })
/**
 * Renders Side bar For entries
 *
 * Context: 
 *  user: userContext
 * 
 * App -> Navbar -> {Link,...}
 */
function Sidebar() {
    const sidebarState = useSelector(getSidebarOpen)
    const {user} = useSelector(getUser)
    const dispatch = useAppDispatch()
    const {data: entries, isLoading} = useGetAllEntriesQuery({});

return (
    <div className="col-span-1 bg-secondary-300">

    </div>
    
    )
  }



export default Sidebar