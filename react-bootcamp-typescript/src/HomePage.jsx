import React from 'react';
import PropTypes from 'prop-types';

/**
 * Home page
 * @return {JSX}
 */
function HomePage({
  username,
}) {
  return (
    <div className="center-text">
      <span> Hello, {username}!</span>
    </div>
  );
}

HomePage.propTypes = {
  username: PropTypes.string.isRequired,
};

export default HomePage;
