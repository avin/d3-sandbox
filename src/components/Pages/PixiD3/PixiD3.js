/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';
import * as Immutable from 'immutable';
import styles from './styles.module.scss';

const data = [];
let i = -10;
do {
    i += 0.1;
    data.push([i, Math.cos(i)]);
} while (i < 10);

export class PixiD3 extends React.Component {
    width = 500;
    height = 200;
    cellSize = 5;

    data = data;
    elements = new Immutable.Map();

    updateScale = () => {
        this.xScale = d3
            .scaleLinear()
            .domain(d3.extent(this.data, d => d[0]))
            .range([0 + this.cellSize, this.width - this.cellSize]);

        this.yScale = d3
            .scaleLinear()
            .domain(d3.extent(this.data, d => d[1]))
            .range([0 + this.cellSize, this.height - this.cellSize]);
    };

    renderNewCell([x, y]) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(chroma(d3.interpolateBlues(Math.abs(y))).num());
        graphics.lineStyle(1, chroma(d3.interpolateGreys(Math.abs(1 - y))).num());
        graphics.drawRect(0, 0, this.cellSize, this.cellSize);
        graphics.x = this.xScale(x);
        graphics.y = this.yScale(y);

        this.elements = this.elements.set(x, graphics);

        this.pixiApp.stage.addChild(graphics);
    }

    draw = () => {
        this.containerRef.appendChild(this.pixiApp.view);

        this.updateScale();

        this.data.forEach((d, idx) => {
            this.renderNewCell(d);
        });

        this.timer = d3.interval(counter => {
            this.updateAndRedraw();
        }, 10);
    };

    updateAndRedraw = () => {
        i += 0.1;
        const [x, y] = data.shift();
        data.slice(1);

        const graphics = this.elements.get(x);
        this.elements = this.elements.delete(x);
        this.pixiApp.stage.removeChild(graphics);

        data.push([i, Math.cos(i)]);

        this.updateScale();

        data.forEach((d, idx) => {
            const [x, y] = d;

            const existOne = this.elements.get(x);
            if (existOne) {
                existOne.x = this.xScale(x);
                existOne.y = this.yScale(y);
            } else {
                this.renderNewCell(d);
            }
        });
    };

    componentDidMount() {
        this.pixiApp = new PIXI.Application({
            width: this.width,
            height: this.height,
            antialias: false, // default: false
            transparent: true, // default: false
            resolution: 1, // default: 1
        });

        this.draw();
    }

    componentWillUnmount() {
        this.timer.stop();
    }

    render() {
        return (
            <div>
                <div
                    className={styles.chart}
                    ref={i => {
                        this.containerRef = i;
                    }}
                />
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
)(PixiD3);
