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
        {isLoading ? (
          <div className="pt-64">
            <h1 className="text-primary-600 font-Raleway text-lg">
              Getting your journal ready...
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-14 w-14 animate-spin rounded-lg bg-primary-500 p-3 text-light-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </div>
        ) : (
          <RouteList />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
