import React from 'react';
import PropTypes from 'prop-types';
import Game from '../Game.jsx';
import './../style.css';

/**
 * BattleLog class
 * Render window where count of remain ships is showed
 */
class BattleLog extends React.Component {
    /**
     * Render
     * @return {JSX}
     */
    render() {
        let shipStats = null;
        let layoutLazyButton = null;
        let layoutStartButton = null;
        let panelColor = '';
        if (this.props.stage === Game.STAGE.PREPARE) {
            shipStats = this.props.map.getShipPlacingStats();
            const wrongPlaced = shipStats.some((shipCount) => shipCount < 0);
            const rightPlaced = shipStats.every((shipCount) => shipCount === 0);
            panelColor = (wrongPlaced) ? 'wrong-placed-ships' : (rightPlaced) ? 'right-placed-ships' : 'wait-placed-ships';
            const startButtonClass = (wrongPlaced) ? 'button-red' : (rightPlaced) ? 'button-green' : 'button-white';

            layoutLazyButton = (
                <button className={'button-blue'} onClick={this.props.onClickLazyButton}>I am lazy</button>
            );

            layoutStartButton = (
                <button className={startButtonClass} disabled={!rightPlaced} onClick={this.props.onCompletePrepare}>Start game</button>
            );
        } else if (this.props.stage === Game.STAGE.GAME) {
            shipStats = this.props.shotMap.getLiveShips();
            panelColor = 'wait-placed-ships';
        }

        return (
            <div className={'battlelog ' + panelColor}>
                <div className={'base-font ships-list'}>Доступные корабли:</div>
                <div align='center' className={'base-font ships-list'}>
                    <table>
                        <thead>
                            <tr>
                                <th>Длина корабля</th>
                                <th>Осталось</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipStats.map((item, index) => (
                                <tr key={index.toString()}>
                                    <td>{index}</td>
                                    <td>{item}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div align='center'>
                    {layoutLazyButton}
                    {layoutStartButton}
                </div>
            </div>
        );
    }
}

BattleLog.propTypes = {
    stage: PropTypes.number,
    map: PropTypes.object,
    shotMap: PropTypes.object,
    onClickLazyButton: PropTypes.func,
    onCompletePrepare: PropTypes.func,
};

export default BattleLog;
