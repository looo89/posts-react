

import React, { useContext } from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import { AuthContext } from '../context/context';
import { privateRoutes, publicRoutes } from './router/router';
import Loader from './UI/Loader/Loader';


function AppRouter() {
  const {isAuth, isLoading}= useContext(AuthContext)
  if (isLoading){
    return <Loader/>
  }

  return(
    isAuth
      ? 
        <Routes>
          {privateRoutes.map(route=>
            <Route element={<route.element/>} path={route.path} key={route.path}/>
          )}
          <Route path="*" element={<Navigate to="/posts" />} />
        </Routes>
      :
        <Routes>
          {publicRoutes.map(route=>
            <Route element={<route.element/>} path={route.path} key={route.path}/>
          )}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
  )
}

export default AppRouter;