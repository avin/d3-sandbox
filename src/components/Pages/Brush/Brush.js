/* eslint-disable indent,prefer-destructuring */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import styles from './styles.module.scss';

export class Brush extends React.Component {
    draw = () => {
        const width = 500;
        const height = 500;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', styles.chart);

        const data = [];

        for (let x = 0; x < 100; x += 1) {
            for (let y = 0; y < 5; y += 1) {
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

        const colors = d3.scaleOrdinal(d3.schemeCategory10);
        const colors2 = d3.scaleOrdinal(d3.schemeGreys[9]);

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
                .attr('fill', (_, i) => colors2(i));
        };

        svg.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .call(drawInitSymbols);

        svg.call(
            d3
                .brush()
                .on('brush', () => {
                    const area = d3.event.selection;

                    svg.selectAll('path')
                        .data(data)
                        .each(([x, y], idx, els) => {
                            if (
                                xScale(x) > area[0][0] &&
                                xScale(x) < area[1][0] &&
                                yScale(y) > area[0][1] &&
                                yScale(y) < area[1][1]
                            ) {
                                d3.select(els[idx])
                                    .transition()
                                    .ease(d3.easeBackOut)
                                    .attr(
                                        'd',
                                        d3
                                            .symbol()
                                            .size(80)
                                            .type(d3.symbolCross)(),
                                    )
                                    .attr('fill', colors(idx));
                            }
                        });
                })
                .on('start', () => {
                    svg.selectAll('path')
                        .data(data)
                        .transition()
                        .call(drawInitSymbols);
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
)(Brush);
