import {  useSelector } from "react-redux";
import { getSidebarOpen } from "../../redux/toggle";
import SidebarItem from "./SidebarItem";

interface EntryInterface {
  id: string
  created_at: string
  updated_at: string | null
  content: string | null
  emoji: string | null
  emoji_name: string | null
  title: string | null
}

/**
 * Renders Side bar For entries
 *
 * Context: 
 *  user: userContext
 * 
 * App -> Navbar -> {Link,...}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Sidebar({entries} : {entries: EntryInterface[]})   {
  const sidebarState = useSelector(getSidebarOpen)
  return (
    <div className={`bg-light-100 border-r-4 ${sidebarState ?"col-span-4" : "col-span-1"}`}>
      {entries && entries.map((entry:EntryInterface, index) => (
        <SidebarItem 
          entry={entry} 
          sidebarOpen={sidebarState} 
          key={entry.id}
          last={index === entries.length-1}/>
      )) }
    </div>
    )
  }



export default Sidebar