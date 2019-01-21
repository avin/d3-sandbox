import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import styles from './styles.module.scss';

export class DraggableChart extends React.Component {
    async draw() {
        const realWidth = 600;
        const realHeight = 400;
        const margin = 30;

        let from = 0;
        let to = 10;

        const maxPoints = 1000;

        const width = realWidth - margin * 2;
        const height = realHeight - margin * 2;

        const svgMain = d3
            .select(this.containerRef)
            .append('svg')
            .classed(styles.chart, true)
            .attr('width', realWidth)
            .attr('height', realHeight);

        let startX;
        svgMain.call(
            d3
                .drag()
                .clickDistance(10)
                .on('start', () => {
                    startX = d3.event.x;
                })
                .on('drag', () => {
                    const diff = d3.event.x - startX;
                    if (diff < -10) {
                        startX = d3.event.x;
                        from = Math.min(maxPoints - 20, from + 1);
                        to = Math.min(maxPoints, to + 1);
                        redraw();
                    }

                    if (diff > 10) {
                        startX = d3.event.x;
                        from = Math.max(0, from - 1);
                        to = Math.max(20, to - 1);
                        redraw();
                    }
                }),
        );

        const svg = svgMain
            .append('g')
            .classed(styles.root, true)
            .attr('transform', `translate(${margin}, ${margin})`);

        this.data = d3.range(maxPoints).map(i => i + Math.random() * 10 + Math.sin(i / 10) * 10);

        const currentData = () => this.data.slice(from, to);

        const xScale = () =>
            d3
                .scaleLinear()
                .domain([0, to - from])
                .range([margin, width]);

        const xAxisScale = () =>
            d3
                .scaleLinear()
                .domain([from, to])
                .range([margin, width]);

        const yScale = () =>
            d3
                .scaleLinear()
                .domain(d3.extent(currentData()))
                .range([height, 0]);

        const line = () =>
            d3
                .line()
                .x((d, i) => xScale()(i))
                .y(d => yScale()(d));

        svg.append('path')
            .attr('class', 'mainPath')
            .datum(currentData())
            .attr('d', line())
            .attr('stroke', '#F00')
            .attr('stroke-width', '2px')
            .attr('fill', 'none');

        const leftAxis = () => d3.axisLeft(yScale());
        const bottomAxis = () => d3.axisBottom(xAxisScale());
        svgMain
            .append('g')
            .attr('class', 'bottomAxis')
            .attr('transform', `translate(0, ${height + margin})`)
            .call(bottomAxis());

        svg.append('g')
            .attr('class', 'leftAxis')
            .call(leftAxis());

        const redraw = () => {
            svg.select('.mainPath')
                .datum(currentData())
                .attr('d', line());

            svgMain
                .select('.bottomAxis')
                .transition()
                .duration(50)
                .call(bottomAxis());

            svg.select('.leftAxis')
                .transition()
                .duration(50)
                .call(leftAxis());
        };
    }

    componentDidMount() {
        window.d3 = d3;
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
)(DraggableChart);
