import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import set from 'lodash/set';
import get from 'lodash/get';
import cn from 'clsx';
import styles from './styles.module.scss';
import { aroundMatrix, countAround, randomArrayElement } from '../../../utils/array';
import { mixColors } from '../../../utils/helpers';

const COLORS = {
    RED: '#f55656',
    GREEN: '#15b371',
    BLUE: '#2b95d6',
};

export class Life extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        data: PropTypes.any,
    };

    static defaultProps = {
        width: 500,
        height: 500,
    };

    state = {
        running: false,
        animate: true,
        newCellFrom: 3,
        newCellTo: 3,
        liveCellFrom: 2,
        liveCellTo: 3,
        activeColor: COLORS.RED,
    };

    cells = [];
    fieldWidth = 51;
    fieldHeight = 51;
    cellSize = 5;
    tickTimerId = null;
    drawing = null;

    drawCell = () => {
        const { activeColor } = this.state;
        const rect = this.svg.node().getBoundingClientRect();
        const mx = d3.event.pageX - rect.left;
        const my = d3.event.pageY - rect.top;
        const x = Math.floor(mx / this.cellSize);
        const y = Math.floor(my / this.cellSize);

        if (this.drawing === 0) {
            if (!this.cells.find(([cy, cx]) => x === cx && y === cy)) {
                this.cells.push([y, x, activeColor]);
            }
        } else if (this.drawing === 2) {
            this.cells = this.cells.filter(([cy, cx]) => !(cy === y && cx === x));
        }

        this.reDraw(true);
    };

    prepareSvg = () => {
        this.svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('class', styles.mainSvg)
            .attr('width', this.fieldWidth * this.cellSize)
            .attr('height', this.fieldHeight * this.cellSize);

        this.svg
            .on('mousedown', () => {
                this.drawing = d3.event.button;
                this.drawCell();
            })
            .on('mousemove', e => {
                if (this.drawing !== null) {
                    this.drawCell();
                }
            })
            .on('mouseleave', e => {
                this.drawing = null;
            })
            .on('mouseup', e => {
                this.drawing = null;
            })
            .on('contextmenu', e => {
                d3.event.preventDefault();
                this.drawing = false;
            });
    };

    reDraw = force =>
        new Promise((resolve, reject) => {
            const dataCells = this.svg.selectAll(`.${styles.cell}`).data(this.cells, ([y, x]) => `${y}_${x}`);

            const processLiveCell = selection => {
                selection
                    .attr('class', styles.cell)
                    .attr('x', d => d[1] * this.cellSize)
                    .attr('y', d => d[0] * this.cellSize)
                    .attr('width', this.cellSize)
                    .attr('height', this.cellSize)
                    .attr('fill', d => d[2]);
            };

            dataCells.call(processLiveCell);

            dataCells
                .enter()
                .append('rect')
                .call(processLiveCell);

            const exitCells = dataCells.exit();

            if (force) {
                exitCells.remove();
                resolve();
            } else if (this.state.animate) {
                exitCells
                    .attr('opacity', 0.9)
                    .attr('fill', '#bfccd6')
                    .transition()
                    .duration(150)
                    .attr('opacity', 0.0)
                    .remove();

                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.timerId = setTimeout(resolve, 200);
            } else {
                exitCells.remove();

                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.timerId = setTimeout(resolve, 10);
            }
        });

    // eslint-disable-next-line sonarjs/cognitive-complexity
    tick = async () => {
        if (this.busy) {
            return;
        }
        const { newCellFrom, newCellTo, liveCellFrom, liveCellTo } = this.state;

        this.busy = true;
        const empty = [];
        const matrix = [];
        const emptyMatrix = [];
        const resultCells = [];

        this.cells.forEach(([y, x, color]) => {
            set(matrix, [y, x], color);
        });

        // Generate empty cells array
        this.cells.forEach(([y, x]) => {
            aroundMatrix.forEach(([yd, xd]) => {
                let ry = y + yd;
                let rx = x + xd;

                if (ry === -1) {
                    ry = this.fieldHeight - 1;
                }
                if (ry === this.fieldHeight) {
                    ry = 0;
                }
                if (rx === -1) {
                    rx = this.fieldWidth - 1;
                }
                if (rx === this.fieldWidth) {
                    rx = 0;
                }

                if (!get(matrix, [ry, rx]) && !get(emptyMatrix, [ry, rx])) {
                    empty.push([ry, rx]);
                    set(emptyMatrix, [ry, rx], 1);
                }
            });
        });

        this.cells.forEach(([y, x, color]) => {
            const [aroundCount] = countAround({
                matrix,
                y,
                x,
                width: this.fieldWidth,
                height: this.fieldHeight,
            });

            if (aroundCount >= liveCellFrom && aroundCount <= liveCellTo) {
                // Stay alive
                resultCells.push([y, x, color]);
            }
        });

        empty.forEach(([y, x]) => {
            const [aroundCount, aroundColors] = countAround({
                matrix,
                y,
                x,
                width: this.fieldWidth,
                height: this.fieldHeight,
            });

            if (aroundCount >= newCellFrom && aroundCount <= newCellTo) {
                // New life
                resultCells.push([y, x, mixColors(aroundColors)]);
            }
        });

        this.cells = resultCells;

        await this.reDraw();

        this.busy = false;

        if (this.state.running) {
            this.tick();
        }
    };

    componentDidMount() {
        this.prepareSvg();
        this.handleRandomize();
        // this.handleStart();
    }

    handleStart = () => {
        this.setState({ running: true }, () => {
            this.tick();
        });
    };

    handleStop = () => {
        if (this.state.running) {
            this.setState({ running: false });
        }
    };

    handleRandomize = () => {
        this.cells = [];
        for (let y = 0; y < this.fieldHeight; y += 1) {
            for (let x = 0; x < this.fieldWidth; x += 1) {
                if (Math.random() > 0.8) {
                    this.cells.push([y, x, randomArrayElement([COLORS.RED, COLORS.GREEN, COLORS.BLUE])]);
                }
            }
        }

        // Glider
        // this.cells = [[10, 10], [11, 11], [12, 11], [12, 10], [12, 9]];

        this.reDraw();
    };

    handleClean = () => {
        this.cells = [];
        this.reDraw(true);
    };

    handleDrawCross = () => {
        const centerY = Math.floor(this.fieldHeight / 2);
        const centerX = Math.floor(this.fieldWidth / 2);

        this.cells = [
            [centerY + 1, centerX, COLORS.RED],
            [centerY - 1, centerX, COLORS.RED],
            [centerY, centerX + 1, COLORS.GREEN],
            [centerY, centerX - 1, COLORS.GREEN],
        ];
        this.reDraw(true);
    };

    handleChangeAnimate = () => {
        this.setState(({ animate }) => ({
            animate: !animate,
        }));
    };

    handleChangeRule = e => {
        const rule = e.currentTarget.name;
        this.setState({
            [rule]: Number(e.currentTarget.value) || 0,
        });
    };

    handleSelectColor = e => {
        const { color } = e.currentTarget.dataset;
        this.setState({
            activeColor: color,
        });
    };

    componentWillUnmount() {
        this.handleStop();
    }

    render() {
        const { running, animate, activeColor, newCellFrom, newCellTo, liveCellFrom, liveCellTo } = this.state;
        return (
            <div className={styles.root}>
                <div
                    ref={i => {
                        this.containerRef = i;
                    }}
                />
                <div className={styles.controls}>
                    <button onClick={this.handleStart} disabled={running}>
                        Start
                    </button>
                    <button onClick={this.handleStop} disabled={!running}>
                        Stop
                    </button>
                    <button onClick={this.handleRandomize}>Randomize</button>
                    <button onClick={this.handleClean}>Clean</button>
                    <button onClick={this.handleDrawCross}>Draw center cross</button>
                    <button onClick={this.tick}>Tick</button>
                </div>

                <div className={styles.controls}>
                    <input type="checkbox" id="animate" checked={animate} onChange={this.handleChangeAnimate} />
                    <label htmlFor="animate">Animate destruction</label>
                </div>
                <div className={styles.controls}>
                    NewCell:&nbsp; &gt;=
                    <input
                        type="text"
                        name="newCellFrom"
                        onChange={this.handleChangeRule}
                        value={newCellFrom}
                        disabled={running}
                    />
                    &nbsp; &lt;=
                    <input
                        type="text"
                        name="newCellTo"
                        onChange={this.handleChangeRule}
                        value={newCellTo}
                        disabled={running}
                    />
                </div>
                <div className={styles.controls}>
                    LiveCell:&nbsp; &gt;=
                    <input
                        type="text"
                        name="liveCellFrom"
                        onChange={this.handleChangeRule}
                        value={liveCellFrom}
                        disabled={running}
                    />
                    &nbsp; &lt;=
                    <input
                        type="text"
                        name="liveCellTo"
                        onChange={this.handleChangeRule}
                        value={liveCellTo}
                        disabled={running}
                    />
                </div>
                <div className={styles.controls}>
                    {[COLORS.RED, COLORS.GREEN, COLORS.BLUE].map(color => (
                        <div
                            key={color}
                            data-color={color}
                            onClick={this.handleSelectColor}
                            style={{ backgroundColor: color }}
                            className={cn(styles.colorButton, {
                                [styles.activeColorButton]: activeColor === color,
                            })}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {},
)(Life);
