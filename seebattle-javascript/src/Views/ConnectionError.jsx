import React from 'react';
import PropTypes from 'prop-types';

/**
 * ConnectionError class
 * Show error message when issue is appeared during request to server
 */
class ConnectionError extends React.Component {
    /**
     * Render
     * @return {JSX}
     */
    render() {
        const message = 'Connection lost :(';

        return (
            <div id="popup">
                <ul>
                    <label className={'base-font information-message'}>{message}</label>
                </ul>
                <button onClick={this.props.onClickMenuButton}>Menu</button>
            </div>
        );
    }
}

ConnectionError.propTypes = {
    onClickMenuButton: PropTypes.func,
};

export default ConnectionError;
