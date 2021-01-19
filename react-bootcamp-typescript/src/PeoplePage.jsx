import React from 'react';
import PropTypes from 'prop-types';
import UserList from './UserList';

/**
 * People page
 * @return {JSX}
 */
function PeoplePage({
  users,
  team,
  onAddToTeam,
  onRemoveFromTeam,
}) {
  return (
    <UserList
      users={users}
      team={team}
      onAddToTeam={onAddToTeam}
      onRemoveFromTeam={onRemoveFromTeam}
    />
  );
}

PeoplePage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  team: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddToTeam: PropTypes.func.isRequired,
  onRemoveFromTeam: PropTypes.func.isRequired,
};

export default PeoplePage;
