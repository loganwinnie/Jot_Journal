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
  const [displayedForm, setDisplayedForm] = useState(true);

  /** toggleForm: Toggles between Login and Signup forms */
  function toggleForm() {
    setDisplayedForm((curr) => !curr);
  }

  return (
    <div
      className={`z-10 w-full rounded-lg border-4 bg-light-100 p-24 transition-all lg:max-w-[33%]
    ${displayedForm ? "animate-smooth2" : "animate-smooth"} bg-opacity-80`}
    >
      {displayedForm ? <LoginForm /> : <SignupForm />}
      <button
        onClick={() => toggleForm()}
        className="mt-4 text-sm text-secondary-500 transition-all hover:scale-105 active:scale-95"
      >
        {displayedForm ? "Create An account" : "Have an account? Login"}
      </button>
    </div>
  );
}

export default AuthArea;
