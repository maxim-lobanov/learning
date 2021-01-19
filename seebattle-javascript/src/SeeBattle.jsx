import React from 'react';
import Game from './Game.jsx';
import Menu from './Views/Menu.jsx';
import ConnectionError from './Views/ConnectionError.jsx';

/**
 * SeeBattle class
 * Primary class that renders all other
 */
class SeeBattle extends React.Component {
    /**
     *  @enum MODE
     */
    static MODE = {
        GAME: 1,
        MENU: 2,
        CONNECTION_ERROR: 3,
    }

    /**
     * @param {object} props
     */
    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
        this.returnToMenu = this.returnToMenu.bind(this);
        this.showConnectionError = this.showConnectionError.bind(this);
        this.state = {
            mode: SeeBattle.MODE.MENU,
        };
    }

    /**
     * Start game with given type of game
     * @param {Game.GAMEMODE} gameType
     */
    startGame(gameType) {
        this._gameType = gameType;
        this.setState({
            mode: SeeBattle.MODE.GAME,
        });
    }

    /**
     * Return back to menu of game
     */
    returnToMenu() {
        this.setState({
            mode: SeeBattle.MODE.MENU,
        });
    }

    /**
     * Show connection error
     */
    showConnectionError() {
        this.setState({
            mode: SeeBattle.MODE.CONNECTION_ERROR,
        });
    }

    /**
     * Render
     * @return {JSX}
     */
    render() {
        const headerLayout = (
                <div>
                    <nav className={'navbar navbar-inverse'}>
                        <div className={'container-fluid'}>
                            <div className={'navbar-header'}>
                                <a className={'navbar-brand'}>SeaBattle</a>
                            </div>
                        </div>
                    </nav>
                </div>
        );

        const mainLayout = (this.state.mode === SeeBattle.MODE.GAME) ? (
            <Game
                type={this._gameType}
                onGameFinish={this.returnToMenu}
                onConnectionLost={this.showConnectionError}
            />
        ) : (this.state.mode === SeeBattle.MODE.MENU) ? (
            <Menu
                onTypeChoose={this.startGame}
            />
        ) : (this.state.mode === SeeBattle.MODE.CONNECTION_ERROR) ? (
            <ConnectionError onClickMenuButton={this.returnToMenu} />
        ) : null;

        return (
            <div>
                {headerLayout}
                {mainLayout}
            </div>
        );
    }
}

export default SeeBattle;
