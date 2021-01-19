import React from 'react';
import PropTypes from 'prop-types';
import Ship from '../Logic/Ship.js';
import Constants from '../Common/Constants.js';

/**
 * Render battle field
 */
class BattleField extends React.Component {
    /**
     * @param {object} props
     */
    constructor(props) {
        super(props);
        this.onFieldClick = this.onFieldClick.bind(this);

        // field size constants

        // indent on the sides of the field
        this.indentSize = 10;

        // believe that Constanst.RowCount === Constants.ColCount
        // two field by width
        const magicConstant = 12;
        const maxFieldWidth = window.innerWidth / 2 - magicConstant;
        const maxFieldHeight = window.innerHeight / 1.5;
        const fieldSizeWithoutIndent = Math.min(maxFieldWidth, maxFieldHeight) - this.indentSize * 2;

        // not less than 20px; not more than 50px;
        this.cellSize = Math.max(Math.min(fieldSizeWithoutIndent / Constants.RowCount, 50), 20);
        this.fieldSize = this.cellSize * Constants.RowCount + this.indentSize * 2;
        this.shipSize = this.cellSize * 0.6;
        this.shotRadius = this.cellSize * 0.16;
        this.shotAssistRadius = this.cellSize * 0.06;
        this.shipRadius = this.cellSize * 0.3;
        this.shipIndentSize = (this.cellSize - this.shipSize) / 2;
        this.triangleIndent = Math.round(this.cellSize / 4);
    }

    /**
     * Render canvas when component was created
     */
    componentDidMount() {
        this.updateCanvas();
    }

    /**
     * Render canvas when component was updated
     */
    componentDidUpdate() {
        this.updateCanvas();
    }

    /**
     * Main function to render canvas
     */
    updateCanvas() {
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#E0E0E0';
        ctx.fillRect(0, 0, this.fieldSize, this.fieldSize);

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let i = 0; i <= Constants.RowCount; i++) {
            ctx.moveTo(this.indentSize, i * this.cellSize + this.indentSize);
            ctx.lineTo(this.fieldSize - this.indentSize, i * this.cellSize + this.indentSize);
            ctx.stroke();
        }

        for (let i = 0; i <= Constants.ColCount; i++) {
            ctx.moveTo(this.indentSize + i * this.cellSize, this.indentSize);
            ctx.lineTo(this.indentSize + i * this.cellSize, this.fieldSize - this.indentSize);
            ctx.stroke();
        }

        for (let y = 0; y < Constants.RowCount; y++) {
            for (let x = 0; x < Constants.ColCount; x++) {
                const ship = this.props.shipMap && this.props.shipMap.get(x, y);
                const shot = this.props.shotMap && this.props.shotMap.get(x, y);

                let cellLeft = this.indentSize + x * this.cellSize;
                let cellTop = this.indentSize + y * this.cellSize;

                if (shot === Constants.SHOT.HURT) {
                    if (this.props.shipMap == null || ship) {
                        // fire
                        ctx.fillStyle = '#e25822';
                        ctx.strokeStyle = '#712a0f';
                        ctx.lineWidth = this.shotRadius / 4;
                        ctx.beginPath();
                        ctx.arc(cellLeft + this.cellSize / 2, cellTop + this.cellSize / 2, this.shipRadius, 0, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.stroke();
                    }
                } else if (shot === Constants.SHOT.FATAL) {
                    if (this.props.shipMap == null || ship) {
                        // fire
                        ctx.fillStyle = '#b3b3ff';
                        ctx.strokeStyle = '#e25822';
                        ctx.lineWidth = this.shotRadius / 2;
                        ctx.fillRect(cellLeft, cellTop, this.cellSize, this.cellSize);
                        ctx.beginPath();
                        ctx.moveTo(cellLeft + this.shipIndentSize, cellTop + this.shipIndentSize);
                        ctx.lineTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop + this.cellSize - this.shipIndentSize);
                        ctx.moveTo(cellLeft + this.shipIndentSize, cellTop + this.cellSize - this.shipIndentSize);
                        ctx.lineTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop + this.shipIndentSize);
                        ctx.stroke();
                    }
                } else if (shot === Constants.SHOT.EMPTY) {
                    if (this.props.shipMap == null || ship == null) {
                        ctx.fillStyle = '#00FF00';
                        ctx.strokeStyle = '#003300';
                        ctx.lineWidth = this.shotRadius * 0.3;
                        ctx.beginPath();
                        ctx.arc(cellLeft + this.cellSize / 2, cellTop + this.cellSize / 2, this.shotRadius, 0, 2 * Math.PI, false);
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        throw new Error('Something went wrong');
                    }
                } else if (shot === Constants.SHOT.NONE) {
                    if (this.props.shipMap && ship != null) {
                        let borderCellStatus = ship.getDirectionStatusForDrawing(x, y);
                        this._renderShipCell(ctx, borderCellStatus, cellLeft, cellTop);
                    } else {
                        const isDestroyedShipAround = (this.props.shotAssist) ? (this.props.shotMap.isDestroyedShipAround(x, y)) : false;
                        if (isDestroyedShipAround) {
                            ctx.fillStyle = '#99994d';
                            ctx.strokeStyle = '#99994d';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(cellLeft + this.cellSize / 2, cellTop + this.cellSize / 2, this.shotAssistRadius, 0, 2 * Math.PI, false);
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                } else if (this.props.shotMap != null) {
                    throw new Error('Something went wrong');
                } else {
                    if (ship) {
                        let borderCellStatus = ship.getDirectionStatusForDrawing(x, y);
                        this._renderShipCell(ctx, borderCellStatus, cellLeft, cellTop);
                    }
                }
            }
        }
    }

    /**
     * Handler for click on field
     * @param {event} event
     */
    onFieldClick(event) {
        const cell = this._convertCoordinatesToCell(event.nativeEvent);
        if (this.props.onMapClick) {
            this.props.onMapClick(cell.X, cell.Y);
        }
    }

    /**
     * Utility function to help convert click coordinates to cell on field
     * @param {event} event
     * @return {Point}
     */
    _convertCoordinatesToCell(event) {
        const clickX = event.pageX - this.canvas.offsetLeft;
        const clickY = event.pageY - this.canvas.offsetTop;
        return {
            X: Math.floor((clickX - this.indentSize) / this.cellSize),
            Y: Math.floor((clickY - this.indentSize) / this.cellSize),
        };
    }

    /**
     * Render cell with ship to draw it in right direction
     * @param {canvas} ctx
     * @param {Ship.DRAW_DIRECTION} borderCellStatus
     * @param {number} cellLeft
     * @param {number} cellTop
     */
    _renderShipCell(ctx, borderCellStatus, cellLeft, cellTop) {
        // blue
        ctx.fillStyle = '#6666ff';
        ctx.strokeStyle = '#3333ff';
        ctx.lineWidth = this.shipSize / 6;

        ctx.beginPath();
        if (borderCellStatus === Ship.DRAW_DIRECTION.SINGLE_SHIP) {
            ctx.fillRect(cellLeft + this.shipIndentSize, cellTop + this.shipIndentSize, this.shipSize, this.shipSize);
            ctx.rect(cellLeft + this.shipIndentSize, cellTop + this.shipIndentSize, this.shipSize, this.shipSize);
            ctx.stroke();
        } else if (borderCellStatus === Ship.DRAW_DIRECTION.HORIZONTAL_LEFT) {
            ctx.moveTo(cellLeft + this.cellSize, cellTop + this.cellSize - this.shipIndentSize);
            ctx.lineTo(cellLeft + this.cellSize / 2, cellTop + this.cellSize - this.shipIndentSize);
            ctx.lineTo(cellLeft + this.triangleIndent, cellTop + this.cellSize / 2);
            ctx.lineTo(cellLeft + this.cellSize / 2, cellTop + this.shipIndentSize);
            ctx.lineTo(cellLeft + this.cellSize, cellTop + this.shipIndentSize);
            ctx.fill();
            ctx.stroke();
        } else if (borderCellStatus === Ship.DRAW_DIRECTION.HORIZONTAL_RIGHT) {
            ctx.moveTo(cellLeft, cellTop + this.cellSize - this.shipIndentSize);
            ctx.lineTo(cellLeft + this.cellSize / 2, cellTop + this.cellSize - this.shipIndentSize);
            ctx.lineTo(cellLeft + this.cellSize - this.triangleIndent, cellTop + this.cellSize / 2);
            ctx.lineTo(cellLeft + this.cellSize / 2, cellTop + this.shipIndentSize);
            ctx.lineTo(cellLeft, cellTop + this.shipIndentSize);
            ctx.fill();
            ctx.stroke();
        } else if (borderCellStatus === Ship.DRAW_DIRECTION.HORIZONTAL_MIDDLE) {
            ctx.fillRect(cellLeft, cellTop + this.shipIndentSize, this.cellSize, this.shipSize);
            ctx.beginPath();
            ctx.moveTo(cellLeft, cellTop + this.shipIndentSize);
            ctx.lineTo(cellLeft + this.cellSize, cellTop + this.shipIndentSize);
            ctx.moveTo(cellLeft, cellTop + this.cellSize - this.shipIndentSize);
            ctx.lineTo(cellLeft + this.cellSize, cellTop + this.cellSize - this.shipIndentSize);
            ctx.stroke();
        } else if (borderCellStatus === Ship.DRAW_DIRECTION.VERTICAL_TOP) {
            ctx.moveTo(cellLeft + this.shipIndentSize, cellTop + this.cellSize);
            ctx.lineTo(cellLeft + this.shipIndentSize, cellTop + this.cellSize / 2);
            ctx.lineTo(cellLeft + this.cellSize / 2, cellTop + this.triangleIndent);
            ctx.lineTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop + this.cellSize / 2);
            ctx.lineTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop + this.cellSize);
            ctx.fill();
            ctx.stroke();
        } else if (borderCellStatus === Ship.DRAW_DIRECTION.VERTICAL_BOT) {
            ctx.moveTo(cellLeft + this.shipIndentSize, cellTop);
            ctx.lineTo(cellLeft + this.shipIndentSize, cellTop + this.cellSize / 2);
            ctx.lineTo(cellLeft + this.cellSize / 2, cellTop + this.cellSize - this.triangleIndent);
            ctx.lineTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop + this.cellSize / 2);
            ctx.lineTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop);
            ctx.fill();
            ctx.stroke();
        } else if (borderCellStatus === Ship.DRAW_DIRECTION.VERTICAL_MIDDLE) {
            ctx.fillRect(cellLeft + this.shipIndentSize, cellTop, this.shipSize, this.cellSize);
            ctx.beginPath();
            ctx.moveTo(cellLeft + this.shipIndentSize, cellTop);
            ctx.lineTo(cellLeft + this.shipIndentSize, cellTop + this.cellSize);
            ctx.moveTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop);
            ctx.lineTo(cellLeft + this.cellSize - this.shipIndentSize, cellTop + this.cellSize);
            ctx.stroke();
        }
    }

    /**
     * Render
     * @return {JSX}
     */
    render() {
        return (
            <canvas
                ref={(ctx) => this.canvas = ctx}
                width={this.fieldSize}
                height={this.fieldSize}
                onClick={this.onFieldClick}
            />
        );
    }
}

BattleField.propTypes = {
    shipMap: PropTypes.object,
    shotMap: PropTypes.object,
    shotAssist: PropTypes.bool,
    onMapClick: PropTypes.func,
};

export default BattleField;
