import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { range } from 'lodash/fp';
import styles from './styles.module.scss';

export class DivHistogram extends React.Component {
    data = range(0, 20).map(v => Math.random() * 50);

    draw = () => {
        const width = this.containerRef.clientWidth;

        const yScale = d3
            .scaleLinear()
            .domain([0, 50])
            .range([100, 300])
            .nice();

        const container = d3.select(this.containerRef);

        // Очищаем старый кеш (но тогда перерисуется всё DOM дерево - это нормально??)
        container.selectAll('div').remove();

        const sections = d3
            .select(this.containerRef)
            .selectAll('div')
            .data(this.data);

        sections
            .enter()
            .append('div')
            .classed(styles.cubic, true)
            .style('height', d => `${yScale(d)}px`)
            .style('width', d => `${width / this.data.length - 3}px`)
            .append('div')
            .classed(styles.label, true)
            .text(d => d.toFixed(2));
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    componentDidMount() {
        this.draw();

        window.addEventListener('resize', this.draw);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.draw);
    }

    render() {
        return (
            <div
                className={styles.chart}
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
)(DivHistogram);
