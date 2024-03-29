import { useState } from "react";
import LoginForm from "./Login";
import SignupForm from "./Signup";


/**
 * Renders Side bar For entries
 *
 * Context: 
 *  user: userContext
 * 
 * App -> Navbar -> {Link,...}
 */
function AuthArea() {
const [displayedForm, setDisplayedForm] = useState(true)

function toggleForm() {
    setDisplayedForm((curr) => !curr)
}

return (
    <div className={`border-4 rounded-lg p-24 w-full lg:max-w-[33%] transition-all bg-light-100 z-10
    ${displayedForm ? "animate-smooth2" : "animate-smooth"} bg-opacity-80`}>
        { displayedForm ?
            <LoginForm/>:
            <SignupForm/>
        }
        <button onClick={() => toggleForm()} 
        className="mt-4 text-sm text-secondary-500 hover:scale-105 active:scale-95 transition-all">
            { displayedForm ? "Create An account" : "Have an account? Login"}
        </button>
    </div>
    )
  }



export default AuthArea