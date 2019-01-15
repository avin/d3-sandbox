/* eslint-disable no-underscore-dangle */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { linearData } from '../../../constants/data';

export class LinearReact extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        data: PropTypes.array,
    };

    static defaultProps = {
        width: 800,
        height: 600,
        data: linearData,
    };

    state = {
        readyToDraw: false,
    };

    configureD3() {
        const { data } = this.props;

        this.margin = { top: 50, right: 50, bottom: 50, left: 50 };
        this.width = this.props.width - this.margin.left - this.margin.right;
        this.height = this.props.height - this.margin.top - this.margin.bottom;

        this.xScale = d3
            .scaleLinear()
            .domain([data[0][0], data[data.length - 1][0]])
            .range([0, this.width]);

        this.yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, ([time, data]) => data)])
            .range([this.height, 0]);

        this.setState({ readyToDraw: true }, () => {
            this.drawPoints();
        });
    }

    componentDidMount() {
        this.configureD3();
    }

    drawPoints() {
        const { data } = this.props;

        const circles = d3
            .select(this.drawArea)
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .classed(styles.dot, true)
            .attr('cx', ([time]) => this.xScale(time))
            .attr('cy', ([time, value]) => this.yScale(value))
            .on('mouseover', function(a, b, el) {
                d3.select(this).moveToFront();
                d3.select(this)
                    .transition()
                    .duration(50)
                    .attr('r', 10);
            })
            .on('mouseout', function(a, position, el) {
                d3.select(this).moveToPosition(position);
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 5);
            });

        circles
            .attr('r', 0)
            .transition()
            .duration(1000)
            .delay((d, i) => (1000 / data.length) * i) // анимация должна суммарно пройти за секунду
            .attr('r', 5);
    }

    render() {
        const { data } = this.props;
        const { readyToDraw } = this.state;

        if (!readyToDraw) {
            return null;
        }

        const line = d3
            .line()
            .x(([time]) => this.xScale(time))
            .y(([time, value]) => this.yScale(value));

        return (
            <div>
                <svg style={{ width: this.props.width, height: this.props.height }} className={styles.chart}>
                    <g
                        transform={`translate(${this.margin.left}, ${this.margin.top})`}
                        ref={i => {
                            this.drawArea = i;
                        }}
                    >
                        <path className={styles.line} d={line(data)} />

                        <g
                            className={clsx(styles.axis, styles.xAxis)}
                            transform={`translate(0, ${this.height})`}
                            ref={g =>
                                d3.select(g).call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%d.%m.%Y')))
                            }
                        />
                        <g
                            className={clsx(styles.axis, styles.yAxis)}
                            ref={g => d3.select(g).call(d3.axisLeft(this.yScale))}
                        />
                    </g>
                </svg>
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
)(LinearReact);
