import LoginForm from "./Authentication/Login";

/**
 * Renders Home Screen if Logged out
 * State: 
 *  user: User Object
 * 
 * App -> Home
 */
function HomeAnon() {

    return (
      <div>
        <h1>YOU ARE CURRENTLY LOGGED OUT</h1>
        <LoginForm/>
      </div>
    )

}

export default HomeAnon