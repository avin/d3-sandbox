import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { range } from 'lodash/fp';
import styles from './styles.module.scss';

export class DivHistogram extends React.Component {
    data = range(0, 200).map(v => Math.random() * 50);

    updateData = () => {
        this.data.push(Math.random() * 50);
        this.data = this.data.slice(1);

        this.draw();

        setTimeout(this.updateData, 50);
    };

    draw = () => {
        if (!this.containerRef) {
            return;
        }
        const width = this.containerRef.clientWidth;

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(this.data)])
            .range([100, 300]);

        const xScale = d3
            .scaleLinear()
            .domain([0, 1])
            .range([0, width / this.data.length - 2]);

        const container = d3.select(this.containerRef);

        container
            .selectAll(`.${styles.cubic}`)
            .data(this.data, v => v)
            .exit()
            .remove();

        container
            .selectAll(`.${styles.cubic}`)
            .data(this.data, v => v)
            .enter()
            .append('div')
            .classed(styles.cubic, true)
            .style('height', d => `${yScale(d)}px`);

        // Навешиваем ширину отдельно - это нужно для ресайза окна
        container.selectAll(`div.${styles.cubic}`).style('width', `${xScale(1)}px`);
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    componentDidMount() {
        this.updateData();

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
