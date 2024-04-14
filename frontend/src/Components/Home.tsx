import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar/Sidebar";
// import { getEntryFormOpen, getSidebarOpen } from "../redux/toggle";
import { useAppSelector } from "../redux/hooks";
import { useGetCurrentUserQuery } from "../api/auth";
import { useEffect } from "react";
import { useGetAllEntriesQuery } from "../api/entry";
import Entry from "./Entries/Entry";
import { getActive, getEntries, setEntries } from "../redux/entry";

/**
 * Renders Home Dashboard if logged in
 * 
 * App -> Home
 */
function Home() {
  const dispatch = useDispatch()
  const token  = useAppSelector((state) => state.user.token?.access_token)
  const {data: user} = useGetCurrentUserQuery({});
  const {data: fetchedEntries, isLoading: entriesLoading} = useGetAllEntriesQuery({});
  const entries = useSelector(getEntries)
  const active = useSelector(getActive)

  /** UseEffect for setting token, entries and user.. */
  useEffect(function () {
    async function userInfo() {
        if (!entriesLoading) {
          dispatch(setEntries({entries: fetchedEntries.entries}))
        }
      } 
    userInfo(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, entriesLoading]);

  /** Use effect for updating entries */
  useEffect(function () {
    function updateEntries() {
      dispatch(setEntries({entries: fetchedEntries?.entries}))
    }  
    updateEntries()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
  <div className="grid grid-cols-16 h-full pt-16 overflow-hidden">
    {!entriesLoading && <Sidebar entries={entries?.entries}/>}
    {entries?.active ? <Entry entry={active} /> : "SELECT AN ENTRY"}     
  </div>
  )

}

export default Home