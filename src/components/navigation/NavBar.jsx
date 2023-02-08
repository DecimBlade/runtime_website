import React, {useState, useEffect} from 'react';
import { Button } from '../Button.js';
import { Link } from 'react-router-dom';
import './Navbar.css';
import '../../App.css'

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showbutton = () => {
    if(window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showbutton();
  }, []);

  window.addEventListener('resize', showbutton);

  return (
    <>
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className="navbar-logo" onClick={closeMobileMenu}>
          RT <i className="fa-thin fa-camera-movie" />
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/dashboard' className='nav-links' onClick={closeMobileMenu}>
              Dashboard
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/watchlist' className='nav-links' onClick={closeMobileMenu}>
              Watchlist
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/friends' className='nav-links' onClick={closeMobileMenu}>
              Friends
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/account' className='nav-links' onClick={closeMobileMenu}>
              Account
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
              Sign Up
            </Link>
          </li>
        </ul>
        {button && <Button buttonStyle='btn--outline'>sign up</Button>}
      </div>
    </nav>
    </>
  )
}

export default Navbar