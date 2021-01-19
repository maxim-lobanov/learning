import React from 'react';
import PropTypes from 'prop-types';
import UserCard from './UserCard';

/**
 * Component that shows list of users
 */
class UserList extends React.Component {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      filterString: '',
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  /**
   * Update state when user updates filter input
   * @param {*} event
   */
  handleFilterChange(event) {
    this.setState({
      filterString: event.target.value.toLowerCase(),
    });
  }

  /**
   * Clear filter input
  */
  clearFilter() {
    this.setState({
      filterString: '',
    });
  }

  /**
   * Render
   * @return {JSX}
   */
  render() {
    const sortUsersFn = (item1, item2) => {
      // sort users by name + surname
      const fullName1 = (`${item1.FirstName} ${item1.LastName}`).toLowerCase();
      const fullName2 = (`${item2.FirstName} ${item2.LastName}`).toLowerCase();
      if (fullName1 < fullName2) {
        return -1;
      } else if (fullName1 > fullName2) {
        return 1;
      }

      return 0;
    };

    const filterUsersFn = (user) => {
      const fullName = `${user.FirstName} ${user.LastName}`;
      return fullName.toLowerCase().includes(this.state.filterString);
    };

    // filter people by filter string
    let processedUsers = this.props.users.filter(filterUsersFn);

    // sort users in alphabetical order
    processedUsers = processedUsers.sort(sortUsersFn);

    return (
      <div className="user-list">
        <div className="row user-filter">
          <div className="col-lg-4">
            <div className="input-group">
              <input
                type="text"
                name="filter"
                value={this.state.filterString}
                onChange={this.handleFilterChange}
                className="form-control"
              />
              <span className="input-group-btn">
                <button onClick={this.clearFilter} className="btn btn-secondary">Clear</button>
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          {processedUsers.map((user) => {
                const isUserInTeam = this.props.team.includes(user);
                return (
                  <UserCard
                    key={user.Id}
                    user={user}
                    onAddToTeam={this.props.onAddToTeam}
                    onRemoveFromTeam={this.props.onRemoveFromTeam}
                    isUserInTeam={isUserInTeam}
                  />
                );
            })}
        </div>
      </div>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  team: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddToTeam: PropTypes.func,
  onRemoveFromTeam: PropTypes.func.isRequired,
};

UserList.defaultProps = {
  onAddToTeam: null,
};

export default UserList;
