import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Header
 * @return {JSX}
 */
function Header({
  isUserAuthorized,
  teamSize,
  onLogout,
}) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand">Prism</a>
        {isUserAuthorized &&
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/people">People</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/team">My team <span className="badge badge-secondary">{teamSize}</span></Link>
              </li>
            </ul>
            <button className="btn btn-outline-info my-2 my-lg-0" onClick={onLogout}>Sign out</button>
          </div>
        }
      </nav>
    </div>
  );
}

Header.propTypes = {
  isUserAuthorized: PropTypes.bool.isRequired,
  teamSize: PropTypes.number.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
