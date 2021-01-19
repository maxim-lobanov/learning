import React from 'react';
import PropTypes from 'prop-types';
import Game from '../Game.jsx';

/**
 * Menu class
 * Render main menu of game
 */
class Menu extends React.Component {
    /**
     * @param {object} props
     */
    constructor(props) {
        super(props);
        this.chooseSinglePlay = this.chooseSinglePlay.bind(this);
        this.chooseMultiPlay = this.chooseMultiPlay.bind(this);
    }

    /**
     * Handler for button 'Singleplayer'
     * Switch to game with mode Game.GAMEMODE.SINGLEPLAYER
     */
    chooseSinglePlay() {
        this.props.onTypeChoose(Game.GAMEMODE.SINGLEPLAYER);
    }

    /**
     * Handler for button 'Multiplayer'
     * Switch to game with mode Game.GAMEMODE.MULTIPLAYER
     */
    chooseMultiPlay() {
        this.props.onTypeChoose(Game.GAMEMODE.MULTIPLAYER);
    }

    /**
     * Render
     * @return {JSX}
     */
    render() {
        return (
            <div>
                <div className={'menu-form'}>
                    <div className={'menu-title'}>Menu</div>
                    <div>
                        <button className={'button-primary'} onClick={this.chooseSinglePlay}>Singleplayer</button>
                    </div>
                    <div>
                        <button className={'button-primary'} onClick={this.chooseMultiPlay}>Multiplayer</button>
                    </div>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    onTypeChoose: PropTypes.func,
};

export default Menu;
