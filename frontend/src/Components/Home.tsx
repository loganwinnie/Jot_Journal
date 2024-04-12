import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar/Sidebar";
// import { getEntryFormOpen, getSidebarOpen } from "../redux/toggle";
import { useAppSelector } from "../redux/hooks";
import { useGetCurrentUserQuery } from "../api/auth";
import { useEffect } from "react";
import { logoutUser, setUser } from "../redux/user";
import { useGetAllEntriesQuery } from "../api/entry";
import Entry from "./Entries/Entry";
import { getEntries, setEntries } from "../redux/entry";


// interface EntryInterface {
//   id: string;
//   created_at: string;
//   updated_at: string | null;
//   content: string | null;
//   emoji: string | null;
//   emoji_name: string | null;
//   title: string | null;
// }
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
  const {data: user} = useGetCurrentUserQuery({});

  const {data: fetchedEntries, isLoading: entriesLoading} = useGetAllEntriesQuery({});
  const entries = useSelector(getEntries)

  /** UseEffect for setting token and user.. */
  useEffect(function () {
    async function userInfo() {
      if (token) {
        localStorage.setItem("token", token!);
        try {
          if (user) {
            dispatch(setUser(user)); 
            if (!entriesLoading) {
              dispatch(setEntries({entries: fetchedEntries.entries}))
            }
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
  }, [token, user, entriesLoading]);

  useEffect(function () {
    function updateEntries() {
      dispatch(setEntries({entries: fetchedEntries?.entries}))
    }  
    updateEntries()
  }, [])

    return (
    <div className="grid grid-cols-16 h-full pt-16 overflow-hidden">
      {!entriesLoading && <Sidebar entries={entries?.entries}/>}
      {entries?.active ? <Entry entry={entries?.active} /> : "SELECT AN ENTRY"}     
    </div>
  )

}

export default Home