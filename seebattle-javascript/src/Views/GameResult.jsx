import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../Common/Constants.js';

/**
 * GameResult class
 * Render popup with message about win of some player
 */
class GameResult extends React.Component {
    /**
     * Render
     * @return {JSX}
     */
    render() {
        const winnerMessage = (this.props.winner === Constants.PLAYER.ME) ? (
            'You win!'
        ) : (this.props.winner === Constants.PLAYER.ENEMY) ? (
            'You lose!'
        ) : (
            'Unknown'
        );

        return (
            <div className={'popup'}>
                {winnerMessage}
            </div>
        );
    }
}

GameResult.propTypes = {
    winner: PropTypes.number,
};

export default GameResult;
