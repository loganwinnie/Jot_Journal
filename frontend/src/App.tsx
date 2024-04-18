import { useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./Components/Navigation/RouteList";
import NavBar from "./Components/Navigation/NavBar";
import { logoutUser, setUser } from "./redux/user";
import { useGetCurrentUserQuery } from "./api/auth";
import { useAppSelector } from "./redux/hooks";
import { useDispatch } from "react-redux";

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
  const token = useAppSelector((state) => state.user.token?.access_token);
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetCurrentUserQuery({});

  /** UseEffect for setting token and user.. */
  useEffect(
    function () {
      async function userInfo() {
        if (token) {
          localStorage.setItem("token", token!);
          try {
            if (user) {
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
    },
    [token, dispatch, user],
  );

  return (
    <div className="no-scrollbar h-fit w-full">
      <BrowserRouter>
        <div>
          <NavBar />
        </div>
        {isLoading ? <div>Loading Content...</div> : <RouteList />}
      </BrowserRouter>
    </div>
  );
}

export default App;
