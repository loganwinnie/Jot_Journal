import Sidebar from "./Sidebar/Sidebar";

/**
 * Renders Home Screen if Logged out
 * State: 
 *  user: User Object
 * 
 * App -> Home
 */
function Home() {

    return (
      <div className="grid grid-cols-4 h-full">
        <Sidebar/>
        <div className="bg-primary-400 w-full col-span-3">
          <h1>hello</h1>
        </div>
      </div>
    )

}

export default Home