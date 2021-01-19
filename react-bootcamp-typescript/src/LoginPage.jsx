import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

/**
 * Login component
 */
class LoginPage extends React.Component {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    // application doesn't have server, so just hardcode credentials here:
    this.hardcodedUserName = 'admin';
    this.hardcodedPassword = 'admin';

    // set correct username right now to not forget it :)
    this.state = {
      inputUsername: this.hardcodedUserName,
      inputPassword: '',
      inputRememberMe: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Update state of inputs
   * @param {*} event
   */
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({
        inputUsername: event.target.value,
      });
    } else if (event.target.name === 'password') {
      this.setState({
        inputPassword: event.target.value,
      });
    } else if (event.target.name === 'rememberme') {
      this.setState({
        inputRememberMe: event.target.checked,
      });
    }
  }

  /**
   * Check if entered data is correct
   * @param {*} event
   */
  handleSubmit(event) {
    const isSuccessLogin = this.state.inputUsername === this.hardcodedUserName &&
                           this.state.inputPassword === this.hardcodedPassword;
    if (isSuccessLogin) {
      toast.success('Successful!');
      this.props.onLogin(this.state.inputUsername, !!this.state.inputRememberMe);
    } else {
      toast.error('Incorrect login or password!');
    }

    event.preventDefault();
  }

  /**
   * Render
   * @return {JSX}
   */
  render() {
    return (
      <div className="login-form-margin">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <h3 className="form-signin-heading text-center">Log Into Prism</h3>
          <hr />
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Name:</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="username"
                value={this.state.inputUsername}
                onChange={this.handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Password:</label>
            <div className="col-sm-10">
              <input
                type="password"
                name="password"
                value={this.state.inputPassword}
                onChange={this.handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="form-check">
            <div className="text-center">
              <input
                type="checkbox"
                name="rememberme"
                value={this.state.inputRememberMe}
                onChange={this.handleChange}
                className="form-check-input center-block large-checkbox"
              />
              <label className="form-check-label center-block">Remember me</label>
            </div>
          </div>
          <div className="text-center" id="signin">
            <input
              type="submit"
              value="Sign in"
              className="btn btn-primary btn-ghost-bordered center-block"
            />
          </div>
        </form>
      </div>
    );
  }
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
