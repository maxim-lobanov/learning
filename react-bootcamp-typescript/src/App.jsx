import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from 'react-router-with-props';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import PeoplePage from './PeoplePage';
import TeamPage from './TeamPage';
import Header from './Header';

/**
 * The main component of application
 */
class App extends React.Component {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    // Check localstorage to determine whether user is already authorized
    const isAuthorized = !!window.localStorage.getItem('isAuthorized');
    if (isAuthorized) {
      setTimeout(() => {
        // call handleLogin to run logic like during login
        this.handleLogin(window.localStorage.getItem('username'));
      }, 0);
    }

    // All data is located in App component and is passed to children using props
    this.state = {
      isAuthorized,
      username: '',
      users: [],
      team: [],
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAddToTeam = this.handleAddToTeam.bind(this);
    this.handleRemoveFromTeam = this.handleRemoveFromTeam.bind(this);
  }

  /**
   * Update state when user authorizes
   * @param {string} username
   * @param {bool} isRememberMe
   */
  handleLogin(username, isRememberMe = false) {
    this.setState({
      isAuthorized: true,
      username,
    });

    // keep info about authorization in local storage
    // since server doesn't exist let's save just "true" value
    if (isRememberMe) {
      window.localStorage.setItem('isAuthorized', 'true');
      window.localStorage.setItem('username', username);
    }

    // only when user authorizes - try to load users from server
    this.loadUserListFromServer();
  }

  /**
   * logout user if he clicks "Logout"
   */
  handleLogout() {
    this.setState({
      isAuthorized: false,
    });

    // clear authorization flag from localstorage
    window.localStorage.removeItem('isAuthorized');
    window.localStorage.removeItem('username');
  }

  /**
   * Get list of users from server
   * TO-DO: move it to separate service
  */
  loadUserListFromServer() {
    const url = 'http://prism.akvelon.net/api/employees/all';
    axios.get(url).then(
      (response) => {
        this.setState({
          users: response.data,
          team: [],
        });
      },
      (error) => {
        toast.error(`Error during loading list of users from server: ${error}`);
      },
    );
  }

  /**
   * Add user to the team
   * @param {object} user
   */
  handleAddToTeam(user) {
    if (this.state.team.includes(user)) {
      toast.error(`User <${user.FirstName} ${user.LastName}> is already in the team!`);
    } else {
      this.setState({
        team: [...this.state.team, user],
      });
      toast.info(`User <${user.FirstName} ${user.LastName}> was added to the team`);
    }
  }

  /**
   * Remove user from the team
   * @param {object} user
   */
  handleRemoveFromTeam(user) {
    if (this.state.team.includes(user)) {
      this.setState({
        team: this.state.team.filter(item => item !== user),
      });
      toast.info(`User <${user.FirstName} ${user.LastName}> was removed from the team`);
    } else {
      toast.error(`User <${user.FirstName} ${user.LastName}> does not exist in the team`);
    }
  }

  /**
   * @return {JSX}
   */
  render() {
    return (
      <div>
        <Router>
          <div>
            <Header
              isUserAuthorized={this.state.isAuthorized}
              teamSize={this.state.team.length}
              onLogout={this.handleLogout}
            />
            <Route exact path="/" render={() => (<Redirect to="/home" />)} />
            <PrivateRoute
              path="/home"
              component={HomePage}
              authed={this.state.isAuthorized}
              redirectTo="/login"
              username={this.state.username}
            />
            <PrivateRoute
              path="/people"
              component={PeoplePage}
              authed={this.state.isAuthorized}
              redirectTo="/login"
              users={this.state.users}
              team={this.state.team}
              onAddToTeam={this.handleAddToTeam}
              onRemoveFromTeam={this.handleRemoveFromTeam}
            />
            <PrivateRoute
              path="/team"
              component={TeamPage}
              authed={this.state.isAuthorized}
              redirectTo="/login"
              team={this.state.team}
              onRemoveFromTeam={this.handleRemoveFromTeam}
            />
            <PublicRoute
              path="/login"
              component={LoginPage}
              authed={this.state.isAuthorized}
              redirectTo="/home"
              onLogin={this.handleLogin}
            />
          </div>
        </Router>
        <ToastContainer
          autoClose={3000}
          hideProgressBar
          pauseOnHover={false}
          newestOnTop
          toastClassName="toastMessage"
          className="toastContainer"
        />
      </div>
    );
  }
}

export default App;
