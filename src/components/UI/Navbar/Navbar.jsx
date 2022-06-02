

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/context';
import MyButton from '../button/MyButton';

function Navbar() {
  const {isAuth, setIsAuth}= useContext(AuthContext)
  const logout =()=>{
    setIsAuth(false)
    localStorage.removeItem('auth')
  }

 
  return(
    <div className='navbar'>
      <MyButton onClick={logout}>Выйти</MyButton>
      <div className='navbar_link'>
        <Link className='link' to='/about'>About</Link>
        <Link className='link' to='/posts'>Posts</Link>
      </div>

  </div>
  )
}

export default Navbar;

