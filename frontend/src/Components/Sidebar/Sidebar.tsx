import { useSelector } from "react-redux";
import { getSidebarOpen } from "../../redux/toggle";
import { useGetAllEntriesQuery } from "../../api/entry";
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import SidebarItem from "./SidebarItem";
init({ data })

interface EntryInterface {
  id: string
  created_at: string
  updated_at: string | null
  content: string
  emoji_code: string
  emoji_name:string
}

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
    const {data: entries, isLoading} = useGetAllEntriesQuery({});

  if (isLoading) return <div><h1>Is loading</h1></div>
  console.log("ENTRIES", entries)
  return (
    <div className={`bg-light-100 border-r-4 ${sidebarState ?"col-span-4" : "col-span-1"}`}>
      {entries.entries.map((entry:EntryInterface, index:number) => {
        <SidebarItem entry={entry} key={index}/>
      })}
    </div>
    )
  }



export default Sidebar