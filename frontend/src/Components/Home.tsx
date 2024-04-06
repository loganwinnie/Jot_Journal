import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar/Sidebar";
// import { getEntryFormOpen, getSidebarOpen } from "../redux/toggle";
import { useAppSelector } from "../redux/hooks";
import { useGetCurrentUserQuery } from "../api/auth";
import { useEffect, useState } from "react";
import { logoutUser, setUser } from "../redux/user";
import { useGetAllEntriesQuery } from "../api/entry";
import Entry from "./Entries/Entry";
import { getEntries, setEntries } from "../redux/entry";


interface EntryInterface {
  id: string;
  created_at: string;
  updated_at: string | null;
  content: string | null;
  emoji: string | null;
  emoji_name: string | null;
  title: string | null;
}
/**
 * Renders Home Screen if Logged out
 * State: 
 *  user: User Object
 * 
 * App -> Home
 */
function Home() {
  // const sidebarState = useSelector(getSidebarOpen)
  // const entryFormOpen = useAppSelector(getEntryFormOpen)
  const dispatch = useDispatch()
  const token  = useAppSelector((state) => state.user.token?.access_token)
  const {data: user, userLoading} = useGetCurrentUserQuery({});

  const {data: fetchedEntries, isLoading: entriesLoading} = useGetAllEntriesQuery({});
  const entries = useSelector(getEntries)
  const [localEntries, setLocalEntries] = useState([])
  const [localActive, setLocalActive] = useState<EntryInterface | null>(null)

  /** UseEffect for setting token and user.. */
  useEffect(function () {
    async function userInfo() {
      if (token) {
        localStorage.setItem("token", token!);
        try {
          if (user) {
            dispatch(setUser(user)); 
            dispatch(setEntries({entries: fetchedEntries}))
          } 
        } catch (err) {
          console.error(err);
          localStorage.clear();
          dispatch(logoutUser());
        }
      } else {
        localStorage.clear();
        dispatch(logoutUser());  
      }
      }
    userInfo(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  useEffect(function () {
    function updateEntries() {
      setLocalEntries(fetchedEntries?.entries)
      setLocalActive(entries?.active)
      dispatch(setEntries({entries: fetchedEntries}))

    }
    
    updateEntries()
  }, [fetchedEntries])

   useEffect(function () {
    function getActive() {
      setLocalActive(entries?.active)
      console.log("ACTIVE", localActive)
    }
    getActive()
  }, [entries])
  
  console.log("ACTIVE", localActive)
  return (
    <div className="grid grid-cols-16 h-full pt-16">
      {!entriesLoading && <Sidebar entries={localEntries}/>}
      {localActive ? <Entry entry={localActive} /> : "SELECT AN ENTRY"}     
      <h1>{localActive?.id || "HELLO"}</h1> 
    </div>
  )

}

export default Home