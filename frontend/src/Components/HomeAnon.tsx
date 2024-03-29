import AuthArea from "./Authentication/AuthArea";
import TextWall from "./TextWall";
/**
 * Renders Home Screen if Logged out
 * State: 
 *  user: User Object
 * 
 * App -> Home
 */
function HomeAnon() {

    return (
      <>
      <TextWall/>
      <div className="flex flex-col-reverse lg:flex-row justify-around lg:items-start items-center lg:pt-32 py-24 px-16 lg:h-full h-fit flex-1 gap-12 bg-light-100 ">
        <div className="p-8 border-4 w-full flex flex-col justify-start items-center gap-16 bg-light-100 rounded-lg z-10 bg-opacity-80">
          <h1 className="text-4xl font-Raleway font-bold underline decoration-primary-300"><span className="font-Flegrei text-primary-200">Jot</span> journal</h1>  
          <img src="/Notebook.svg" alt="Logo" className="w-48 h-48 rotate-12"/>
          <h3 className="text-xl font-semibold">Your new Ai journaling companion to make writing daily
          a little easier.
          </h3>
          <div className="w-full px-20">
            <p className="text-left"><span className="font-bold text-secondary-400">Powered by Gtp-3.5</span> Jot Journal sit amet, consectetur adipiscing elit. Pellentesque vel rutrum erat. Nam dapibus risus leo, ut consequat nunc pulvinar vel. Vivamus non est volutpat, gravida nisl ut, scelerisque magna. Fusce sit amet molestie leo, id condimentum mi. Donec volutpat urna at vestibulum iaculis. Sed a diam nibh. Aliquam pulvinar, eros sed porttitor iaculis, lacus mauris laoreet ligula, ac porta magna mi a augue. Etiam gravida turpis quis aliquet convallis. Sed enim nisi, finibus in accumsan vitae, vehicula eget libero. Aliquam eu tortor at orci viverra imperdiet eu ut ligula. Donec vehicula leo neque, vitae dapibus orci consectetur tincidunt. In dignissim cursus cursus.</p>
          </div>
        </div> 
        <AuthArea/>
      </div>
      </>
    )

}

export default HomeAnon