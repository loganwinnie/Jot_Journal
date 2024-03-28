
interface item {
    emoji_name: string,
    emoji_code: string,
    content: string,
}

/**
 * Renders Side bar For entries
 *
 * Context: 
 *  user: userContext
 * 
 * App -> Navbar -> {Link,...}
 */
function Sidebar({entry}: {entry: item}) {

return (
    <div className="col-span-1 bg-secondary-300">
    </div>
    
    )
  }



export default Sidebar