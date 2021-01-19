import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component that shows card of user
 * @return {JSX}
 */
function UserCard({
  user,
  isUserInTeam,
  onAddToTeam,
  onRemoveFromTeam,
}) {
  /**
   * Add current user to the team
   */
  const handleAddToTeam = () => {
    onAddToTeam(user);
  };

  /**
   * Remove current user from the team
   */
  const handleRemoveFromTeam = () => {
    onRemoveFromTeam(user);
  };

  const fullName = `${user.FirstName} ${user.LastName}`;
  const actionButton = (!isUserInTeam) ? (
    <button className="btn btn-outline-primary btn-block bottom-btn" onClick={handleAddToTeam}>Add to my team</button>
  ) : (
    <button className="btn btn-outline-danger btn-block bottom-btn" onClick={handleRemoveFromTeam}>Remove from my team</button>
  );

  return (
    <div className="col-md-4">
      <div className="container py-3 col-md-12">
        <div className="card card-border">
          <div className="row">
            <div className="col-md-3">
              <img
                src={`http://prism.akvelon.net/api/system/getphoto/${user.Id}`}
                alt={`< ${fullName} >`}
                className="user-photo"
              />
            </div>
            <div className="px-3">
              <div className="card-block px-3">
                <h4 className="card-title top-card-title">{fullName}</h4>
                {actionButton}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  isUserInTeam: PropTypes.bool.isRequired,
  onAddToTeam: PropTypes.func,
  onRemoveFromTeam: PropTypes.func.isRequired,
};

UserCard.defaultProps = {
  onAddToTeam: null,
};

export default UserCard;
