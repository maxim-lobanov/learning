import React from 'react';
import PropTypes from 'prop-types';
import Game from '../Game.jsx';

/**
 * WaitingForGame class
 * Render window during waiting for enemy play in multiplayer
 */
class WaitingForGame extends React.Component {
    /**
     * Render
     * @return {JSX}
     */
    render() {
        const message = (this.props.type === Game.STAGE.WAITING_SEARCH_PLAYER) ? (
            'Идет поиск соперника...'
        ) : (this.props.type === Game.STAGE.WAITING_PREPARE) ? (
            'Ожидаем пока соперник расставит корабли'
        ) : (
            null
        );

        return (
            <div id="popup">
                <ul>
                    <label className={'base-font information-message'}>{message}</label>
                </ul>
            </div>
        );
    }
}

WaitingForGame.propTypes = {
    type: PropTypes.number,
};

export default WaitingForGame;
