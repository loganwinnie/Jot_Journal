import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar/Sidebar";
import { getSidebarOpen } from "../redux/toggle";
import { useAppSelector } from "../redux/hooks";
import { useGetCurrentUserQuery } from "../api/auth";
import { useEffect } from "react";
import { logoutUser, setUser } from "../redux/user";

/**
 * Renders Home Screen if Logged out
 * State: 
 *  user: User Object
 * 
 * App -> Home
 */
function Home() {
  const sidebarState = useSelector(getSidebarOpen)
  const token  = useAppSelector((state) => state.user.token?.access_token)
  const dispatch = useDispatch()
  const {data: user, isLoading} = useGetCurrentUserQuery({});

  /** UseEffect for setting token and user.. */
  useEffect(function () {
    async function userInfo() {
      if (token) {
        localStorage.setItem("token", token!);
        try {
          if (user) {
            console.log("QUERY", user)
            dispatch(setUser(user));
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
  }, [token, dispatch, user]);


  return (
    <div className="grid grid-cols-16 h-full">
      <Sidebar/>
      <div className={`bg-light-100 h-full ${sidebarState ? "col-span-12" : "col-span-15"}`}>
        <h1>hello</h1>
      </div>
    </div>
  )

}

export default Home