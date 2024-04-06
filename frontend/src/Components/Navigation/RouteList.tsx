/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from "../../redux/hooks"
import HomeAnon from '../HomeAnon';
import Home from '../Home';


// interface RouteInterface {
//   signup: (FormData: {
//         password: string,
//         firstName: string,
//         lastName: string,
//         username: string
//     }) => void
//    login: (FormData: {
//         password: string,
//         username: string
//     }) => void
//    deleteUser: () =>Promise<{deleted: any;}>
//    createEntry: (content: {content: string}) => Promise<any>
//    patchEntry: (entryId: string, content: {content: string}) => Promise<any>
//    deleteEntry: (entryId: string) => Promise<any>
// }

/**
 *  RouteList
 * 
 * App-> RouteList -> Rest of components
 */
function RouteList( ) {
  const token = useAppSelector((state) => state.user.token)
  const routesLoggedOut = (
    <>
     <Route element={<HomeAnon/>} path="/"/>
    </>
  )

  const routesLoggedIn = (
    <>
     <Route element={<Home/>} path="/"/>
    </>
  )
    
    

  return (
    <Routes>
      {token ? routesLoggedIn : routesLoggedOut};
    </Routes>
  );
}

export default RouteList;