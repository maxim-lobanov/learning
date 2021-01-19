import React from 'react';
import PropTypes from 'prop-types';
import UserList from './UserList';

/**
 * Team page
 * @return {JSX}
 */
function TeamPage({
  team,
  onRemoveFromTeam,
}) {
  return (team.length > 0) ? (
    <UserList users={team} team={team} onAddToTeam={null} onRemoveFromTeam={onRemoveFromTeam} />
  ) : (
    <div className="center-text">
      <span> There are no people on your team ...</span>
    </div>
  );
}

TeamPage.propTypes = {
  team: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRemoveFromTeam: PropTypes.func.isRequired,
};

export default TeamPage;
