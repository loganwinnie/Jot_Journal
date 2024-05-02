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
          <div className="flex flex-col items-center justify-center gap-12 pt-64">
            <h1 className="font-Raleway text-lg text-primary-600">
              Getting your journal ready...
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`h-20 w-20 animate-spin rounded-full bg-primary-500 p-3 text-light-200`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
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
