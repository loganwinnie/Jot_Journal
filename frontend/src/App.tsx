import { useEffect, useState } from 'react';
import './App.css'
import JournalAPI from './api';
import { BrowserRouter } from "react-router-dom";
import RouteList from './Navigation/RouteList';
import userContext from "./userContext"
import NavBar from './Navigation/NavBar';


interface UserInterface {
  email: string
  first_name: string
  last_name: string
  password: string
  created_at: string
}

/**
 * App Controller Component.
 *
 * State: 
 *  user: userState used in context.
 *  token: Active session token for user. 
 *  isLoading: Loading state to display while User is being fetched.
 * 
 * Context Provider: 
 *  user: userContext
 * 
 * App
 */
function App() {
  const [user, setUser] = useState< UserInterface | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sideBarOpen, setSideBar] = useState<boolean>(true)
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  /** UseEffect for setting token and user.. */
  useEffect(function () {
    async function fetchUserInfo() {
      // setIsLoading(true);

      if (token) {
        localStorage.setItem("token", token);
        JournalAPI.token = token;
        try {
          const user = await JournalAPI.getUserFromToken();
          setUser(user);
        } catch (err) {
          console.error(err);
          localStorage.clear();
          setToken(null)
          setUser(null);
        }
      } else {
        localStorage.clear();
        setUser(null);
      }
      // setIsLoading(false);
      }
    fetchUserInfo();
  }, [token]);

  /** signup: Signup  user. Passed formData. Sets token. */
  async function signup(formData : {
        password: string,
        firstName: string,
        lastName: string,
        username: string
    }) {
    const res = await JournalAPI.signup(formData);
    setToken(res.token)
  }

  /** login: Login user. Passed formData. Sets token. */
  async function login(formData: {username: string, password: string} ) {
    const res = await JournalAPI.login(formData);
    setToken(res.token)
  }

  /** deleteUser: Deletes a user. Clears token*/
  async function deleteUser() {
    const deleted = await JournalAPI.deleteUser();
    setToken(null);
    return { deleted };
  } 

  async function createEntry(content: {content: string}) {
    const res = await JournalAPI.createEntry(content)
    // setUser((userData) => ({...userData!, entries: []}))
    return res
  }

  async function patchEntry(entryId: string, content: {content: string}) {
    const res = await JournalAPI.patchUserEntry(entryId, content)
    return res
  }

  async function deleteEntry(entryId: string) {
    const res = await JournalAPI.deleteUserEntry(entryId)
    return res
  }


  return (
  <>
    <BrowserRouter>
    <div>
      <NavBar />
    </div>
      <RouteList 
        signup={signup}
        login={login}       
        deleteUser={deleteUser}
        createEntry={createEntry}
        patchEntry={patchEntry}
        deleteEntry={deleteEntry}
      />
    </BrowserRouter>
  </>
  )
}

export default App
