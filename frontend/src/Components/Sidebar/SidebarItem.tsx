import { useDispatch, useSelector } from "react-redux";
import {getEntries, setActive } from "../../redux/entry";

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
 * App -> Sidebar ->SidebarItem
 */
function SidebarItem({entry, sidebarOpen, last}: {
  entry: EntryInterface, 
  last: boolean
  sidebarOpen: boolean
}) {

  const entries = useSelector(getEntries)
  const dispatch = useDispatch()

  function updateActive() {
    dispatch(setActive({entry}))
  }

  function ifOpen() {
    return (
      entry && 
        <div className={`flex items-center justify-start p-4 gap-4 border-t-2 border-light-200
         hover:bg-light-200 ${last && "border-b-2"} ${entries?.active?.id === entry.id && "bg-light-200"}
         `}
          id={entry.id}
          onClick={() => updateActive()}>
           { entry.emoji && entry.emoji_name ?
            <h4 className="text-3xl" aria-details={entry.emoji_name}>{entry.emoji}</h4>
            :
            <div className="rounded-full bg-light-300 opacity-70 w-12 h-12"></div>
          }
          <h1 className="text-xl font-bold font-Raleway">{entry.title || "No Title"}</h1>
          <p>{entry.updated_at}</p>
        </div>
        )
  }
  function ifClosed() {
    return (
      entry && 
        <div 
          className={`flex items-center justify-center py-4 border-t-2 border-light-200
         hover:bg-light-200 ${last && "border-b-2"} ${entries?.active?.id === entry.id && "bg-light-200"}
         `}
          id={entry.id}
          onClick={() => updateActive()}
         >
          { entry.emoji && entry.emoji_name ?
            <h4 className="text-3xl" aria-details={entry.emoji_name}>{entry.emoji}</h4>
            :
            <div className="rounded-full bg-light-300 opacity-70 w-12 h-12"></div>
          }
        </div>
        )
  }
  return sidebarOpen ? ifOpen() : ifClosed()
  }



export default SidebarItem