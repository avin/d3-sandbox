/* eslint-disable indent,prefer-destructuring,no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import styles from './styles.module.scss';

export class Hierarchy extends React.Component {
    draw = () => {
        const width = 500;
        const height = 500;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', styles.chart);

        const data = [
            { name: 'Bob', parent: '' },
            { name: 'Alice', parent: 'Bob' },
            { name: 'Mike', parent: 'Bob' },
            { name: 'John', parent: 'Alice' },
        ];

        const root = d3
            .stratify()
            .id(d => d.name)
            .parentId(d => d.parent)(data);

        const treemap = d3
            .treemap()
            .size([width, height])
            .padding(2);

        const line = d3.line();

        // svg.selectAll('.link')
        //     .data(treemap(root).descendants().slice(1))
        //     .enter()
        //     .append('path')
        //     .attr('stroke', '#F00')
        //     .attr('stroke-width', '1px')
        //     .attr('d', d => {
        //         console.log(d);
        //         return line([[d.x0, d.y0], [d.parent.x1, d.parent.y1]])
        //     });
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
)(Hierarchy);
