import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { dotsData } from '../../../constants/data';

export class DotsMap extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        data: PropTypes.array,
    };

    static defaultProps = {
        width: 800,
        height: 600,
        data: dotsData,
    };

    marked = [];

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

        const [xMin, xMax] = d3.extent(data, d => d.x);
        const xAvg = (xMax - xMin) / data.length;
        const xScale = d3
            .scaleLinear()
            .domain([xMin - xAvg, xMax + xAvg])
            .range([0, width]);

        const [yMin, yMax] = d3.extent(data, d => d.y);
        const yAvg = (yMax - yMin) / data.length;
        const yScale = d3
            .scaleLinear()
            .domain([yMin - yAvg, yMax + yAvg])
            .range([height, 0]);

        const sizeScale = d3
            .scaleLinear()
            .domain([d3.min(data, d => d.size), d3.max(data, d => d.size)])
            .range([10, 50])
            .nice();

        const sizeFontScale = d3
            .scaleLinear()
            .domain([d3.min(data, d => d.size), d3.max(data, d => d.size)])
            .range([8, 15]);

        svg.append('g') // xAxis
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(xScale)
                    .tickSizeOuter(0)
                    .tickFormat(d => `~${d}`),
            );

        svg.append('g') // xAxis - GRID
            .attr('transform', `translate(0, ${height})`)
            .attr('class', styles.grid)
            .call(
                d3
                    .axisBottom(xScale)
                    .tickSizeInner(-height)
                    .tickSizeOuter(0)
                    .tickFormat(''),
            )
            .select('.domain')
            .remove();

        svg.append('g') // yAxis
            .call(d3.axisLeft(yScale).tickSizeOuter(0));

        svg.append('g') // yAxis - GRID
            .attr('class', styles.grid)
            .call(
                d3
                    .axisLeft(yScale)
                    .tickSizeOuter(0)
                    .tickSizeInner(-width)
                    .tickFormat(''),
            )
            .select('.domain')
            .remove();

        // .tickSizeInner(-width)
        // .tickSizeOuter(0)

        // circles
        const circles = svg
            .selectAll(styles.circle)
            .data(data)
            .enter()
            .append('circle')
            .classed(styles.circle, true)
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 0)
            .attr('opacity', 0.8);

        circles
            .transition()
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr('r', d => sizeScale(d.size));

        circles.on('click', (_, idx, els) => {
            const isMarked = this.marked.indexOf(idx) > -1;

            const circle = d3.select(els[idx]);
            circle.classed(styles.activeCircle, !isMarked);

            if (!isMarked) {
                circle
                    .transition()
                    .ease(d3.easeBounceOut)
                    .duration(500)
                    .attr('r', d => sizeScale(d.size) + 10);
            } else {
                circle
                    .transition()
                    .ease(d3.easeBounceOut)
                    .duration(500)
                    .attr('r', d => sizeScale(d.size));
            }

            if (isMarked) {
                this.marked = this.marked.filter(i => i !== idx);
            } else {
                this.marked = [...this.marked, idx];
            }

            this.updateSelected();
        });

        // labels
        svg.selectAll(styles.label)
            .data(data)
            .enter()
            .append('text')
            .classed(styles.label, true)
            .text(d => d3.format('.0%')(d.size))
            .attr('x', d => xScale(d.x))
            .attr('y', d => yScale(d.y))
            .style('font-size', d => sizeFontScale(d.size))
            .attr('opacity', 0)
            .transition()
            .delay(300)
            .ease(d3.easeLinear)
            .attr('opacity', 1);
    };

    updateSelected() {
        const { data } = this.props;

        const items = d3
            .select(this.selectedRef)
            .selectAll(`.${styles.selectedItem}`)
            .data(this.marked, d => d);

        items
            .enter()
            .append('div')
            .classed(styles.selectedItem, true)
            .text(d => data[d].size);

        items.exit().remove();
    }

    componentDidMount() {
        this.draw();
    }

    render() {
        return (
            <div>
                <div
                    ref={i => {
                        this.containerRef = i;
                    }}
                />
                <div
                    ref={i => {
                        this.selectedRef = i;
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
)(DotsMap);
