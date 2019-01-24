/* eslint-disable indent,prefer-destructuring,no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import clsx from 'clsx';
import styles from './styles.module.scss';
import chartFactory from '../../../common';

export class Hierarchy extends React.Component {
    draw = () => {
        const width = 500;
        const height = 500;

        const data = [
            { name: 'Bob', parent: '' },
            { name: 'Alice', parent: 'Bob' },
            { name: 'Mike', parent: 'Bob' },
            { name: 'John', parent: 'Alice' },
        ];

        const treeData = d3.hierarchy(
            d3
                .stratify()
                .id(d => d.name)
                .parentId(d => d.parent)(data),
        );

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('class', styles.chart)
            .attr('width', width + 30)
            .attr('height', height + 30)
            .append('g')
            .attr('transform', `translate(15,15)`);

        const treemap = d3.tree().size([height, width]);

        const nodes = treemap(treeData);

        const link = svg
            .selectAll('.link')
            .data(nodes.descendants().slice(1))
            .enter()
            .append('path')
            .attr('class', styles.link)
            .attr('d', d =>
                d3.line().curve(d3.curveBundle)([
                    [d.x, d.y],
                    [d.x, (d.y + d.parent.y) / 2],
                    [d.parent.x, (d.y + d.parent.y) / 2],
                    [d.parent.x, d.parent.y],
                ]),
            );

        const nodeEls = svg
            .selectAll(`.${styles.node}`)
            .data(nodes.descendants())
            .enter()
            .append('g')

            .attr('class', d => clsx(styles.node, d.children ? styles.nodeInternal : styles.nodeLeaf))
            .attr('transform', d => `translate(${d.x},${d.y})`);

        nodeEls
            .on('mouseover', (_, idx, nodes) => {
                d3.select(nodes[idx])
                    .select('circle')
                    .transition()
                    .ease(d3.easeCircleOut)
                    .attr('r', 15);

                d3.select(nodes[idx])
                    .select('text')
                    .transition()
                    .attr('dx', '1.25em');
            })
            .on('mouseleave', (_, idx, nodes) => {
                d3.select(nodes[idx])
                    .select('circle')
                    .transition()
                    .ease(d3.easeBounceOut)
                    .attr('r', 10);

                d3.select(nodes[idx])
                    .select('text')
                    .transition()
                    .attr('dx', '.75em');
            });

        nodeEls.append('circle').attr('r', 10);

        nodeEls
            .append('text')
            .attr('dx', '.75em')
            .attr('dy', '.35em')
            .text(d => d.data.data.name);
    };

    componentDidMount() {
        this.draw();
    }

    render() {
        return (
            <div
                className={styles.root}
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
