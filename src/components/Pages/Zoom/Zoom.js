/* eslint-disable indent,prefer-destructuring */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import styles from './styles.module.scss';

export class Zoom extends React.Component {
    draw = () => {
        const width = 500;
        const height = 500;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', styles.chart);

        const svgContent = svg.append('g');

        const data = [];

        for (let x = 0; x < 100; x += 1) {
            for (let y = 0; y < 10; y += 1) {
                data.push([x, Math.random() * 100]);
            }
        }

        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d[0]))
            .range([0, width]);
        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d[1]))
            .range([0, height]);

        const drawInitSymbols = selection => {
            selection
                .attr(
                    'd',
                    d3
                        .symbol()
                        .size(20)
                        .type(d3.symbolCross),
                )
                .attr('transform', ([x, y]) => `translate(${xScale(x)}, ${yScale(y)})`)
                .attr('fill', (_, i) => d3.interpolateBlues(1));
        };

        svgContent
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .call(drawInitSymbols);

        svg.call(
            d3.zoom().on('zoom', () => {
                const transform = d3.event.transform;
                svgContent.attr('transform', `translate(${transform.x},${transform.y})`);
                // svgContent.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);

                const xScale = d3
                    .scaleLinear()
                    .domain(d3.extent(data, d => d[0]))
                    .range([0, width * transform.k]);
                const yScale = d3
                    .scaleLinear()
                    .domain(d3.extent(data, d => d[1]))
                    .range([0, height * transform.k]);

                svgContent
                    .selectAll('path')
                    .data(data)
                    .attr('transform', ([x, y]) => `translate(${xScale(x)}, ${yScale(y)})`)
                    .attr('fill', (_, i) => d3.interpolateBlues(Math.max(0.3, 1 / transform.k)));
            }),
        );
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
)(Zoom);
