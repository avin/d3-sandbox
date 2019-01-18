import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const graphData = {
    nodes: [{ name: 'A1' }, { name: 'A2' }, { name: 'A3' }, { name: 'B1' }, { name: 'B2' }, { name: 'B3' }],
    links: [
        {
            source: 0,
            target: 1,
            value: 1,
        },
        {
            source: 1,
            target: 2,
            value: 1,
        },
        {
            source: 2,
            target: 0,
            value: 1,
        },

        {
            source: 3,
            target: 4,
            value: 1,
        },
        {
            source: 4,
            target: 5,
            value: 1,
        },
        {
            source: 5,
            target: 3,
            value: 1,
        },

        {
            source: 5,
            target: 0,
            value: 1,
        },
    ],
};

export class ForceLayout extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        data: PropTypes.any,
    };

    static defaultProps = {
        width: 500,
        height: 500,
        data: graphData,
    };

    draw = () => {
        const { data } = this.props;
        const { nodes, links } = data;

        const drag = simulation => {
            function dragstarted(d) {
                if (!d3.event.active) {
                    simulation.alphaTarget(0.5).restart();
                }
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) {
                    simulation.alphaTarget(0.5);
                }
                d.fx = null;
                d.fy = null;
            }

            return d3
                .drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        };

        const width = 800;
        const height = 600;
        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .classed(styles.mainSvg, true)
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation(nodes);
        simulation.force('link', d3.forceLink(links));
        simulation.force('charge', d3.forceManyBody().strength(-1000));
        simulation.force('center', d3.forceCenter(width / 2, height / 2));

        simulation.on('tick', () => {
            link.attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)
                .style('stroke', d => {
                    if (d.source.name === 'B3' && d.target.name === 'A1') {
                        return '#d9822b';
                    }
                    return undefined;
                });

            node.attr('cx', d => d.x).attr('cy', d => d.y);
        });

        const link = svg
            .selectAll(`.${styles.link}`)
            .data(links)
            .enter()
            .append('line')
            .attr('class', styles.link);

        const node = svg
            .selectAll(`.${styles.node}`)
            .data(nodes)
            .enter()
            .append('circle')
            .attr('class', styles.node)
            .attr('fill', d => (d.name.startsWith('A') ? '#2b95d6' : '#f5498b'))
            .attr('r', 8)
            .call(drag(simulation));
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
)(ForceLayout);
