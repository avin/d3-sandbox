import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { linearData } from '../../../constants/data';

export class LinearClassic extends React.Component {
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

    draw = () => {
        const { data } = this.props;

        const margin = { top: 50, right: 50, bottom: 50, left: 50 };

        const width = this.props.width - margin.left - margin.right;
        const height = this.props.height - margin.top - margin.bottom;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .classed(styles.chart, true)
            .style('width', `${this.props.width}px`)
            .style('height', `${this.props.height}px`)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = d3
            .scaleLinear()
            .domain([data[0][0], data[data.length - 1][0]])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, ([time, data]) => data)])
            .range([height, 0]);

        const line = d3
            .line()
            .x(([time, value]) => xScale(time))
            .y(([time, value]) => yScale(value));

        svg.append('g')
            .classed(clsx(styles.axis, styles.xAxis), true)
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%d.%m.%Y')));

        svg.append('g')
            .classed(clsx(styles.axis, styles.yAxis), true)
            .call(d3.axisLeft(yScale));

        svg.append('path')
            .datum(data)
            .classed(styles.line, true)
            .attr('d', line);

        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .classed(styles.dot, true)
            .attr('cx', ([time, value]) => xScale(time))
            .attr('cy', ([time, value]) => yScale(value))
            .attr('r', 5)
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
    };

    componentDidMount() {
        this.draw();
    }

    render() {
        return (
            <div
                ref={i => {
                    this.containerRef = i;
                }}
            />
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {},
)(LinearClassic);
