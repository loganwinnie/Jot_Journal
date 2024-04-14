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
    <div className={`bg-light-100 border-r-4 ${sidebarState ?"col-span-3" : "col-span-1"} max-h-full overflow-y-scroll no-scrollbar`}>
      {entries && entries.map((entry:EntryInterface, index) => (
        <SidebarItem 
          entry={entry} 
          sidebarOpen={sidebarState} 
          key={`${entry.id}+${index}`}
          last={index === entries.length-1}/>
      )) }
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 fixed bottom-4 left-4 text-white text-bold bg-dark-300 p-2 rounded-full opacity-60 filter bg-blend-color-dodge">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
      </svg>

    </div>
    )
  }



export default Sidebar