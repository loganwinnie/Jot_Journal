/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from "react";
import userContext from "../userContext";


interface RouteInterface {
  signup: (FormData: {
        password: string,
        firstName: string,
        lastName: string,
        username: string
    }) => void
   login: (FormData: {
        password: string,
        username: string
    }) => void
   deleteUser: () =>Promise<{deleted: any;}>
   createEntry: (content: {content: string}) => Promise<any>
   patchEntry: (entryId: string, content: {content: string}) => Promise<any>
   deleteEntry: (entryId: string) => Promise<any>
}

/**
 *  RouteList
 * 
 * App-> RouteList -> Rest of components
 */
function RouteList({ 
  signup,
  login,
  deleteUser,
  createEntry,
  patchEntry,
  deleteEntry,
  }: RouteInterface ) {
  const user = useContext< | null>(userContext);

  // const routesLoggedIn = (
  //   <>
  //    <Route element={<MyEvents  deleteEvent={deleteEvent} />}path="/my-events"/>
  //   </>
  // )
    

  return (
    <Routes>
      {/* {user ? routesLoggedIn : routesLoggedOut}; */}
    </Routes>
  );
}

export default RouteList;