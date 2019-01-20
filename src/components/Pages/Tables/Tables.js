/* eslint-disable indent */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import styles from './styles.module.scss';

const data = [['T1', 'T2', 'T3', 'T4']];
for (let rn = 0; rn < 20; rn += 1) {
    const row = [];
    for (let dn = 0; dn < data[0].length; dn += 1) {
        row.push(Math.floor(Math.random() * 100));
    }
    data.push(row);
}

const makeTable = (data, container, options) => {
    const opts = { ...options };

    const header = data[0];

    let activeColumn;
    let activeRow;

    const tableData = data.slice(1);

    const table = d3
        .select(container)
        .append('table')
        .attr('class', opts.className);

    table.on('mouseleave', (_, idx) => {
        activeColumn = undefined;
        activeRow = undefined;
        redrawTrs();
        redrawTds();
    });

    table
        .append('thead')
        .append('tr')
        .selectAll('th')
        .data(header)
        .enter()
        .append('th')
        .text(d => d);

    const tableDataSelection = () =>
        table
            .select('tbody')
            .selectAll('tr')
            .data(tableData);

    const redrawTds = () => {
        tableDataSelection()
            .selectAll('td')
            .data(d => d)
            .transition()
            .duration(100)
            .style('background-color', (d, i) =>
                i === activeColumn
                    ? chroma('#48aff0')
                          .alpha(0.5)
                          .css()
                    : undefined,
            );
    };

    const redrawTrs = () => {
        tableDataSelection()
            .transition()
            .duration(100)
            .style('background-color', (d, i) =>
                i === activeRow
                    ? chroma('#ffb366')
                          .alpha(0.5)
                          .css()
                    : undefined,
            );
    };

    const processTds = selection => selection
            .append('td')
            .style('font-weight', (d, i) => (i === 0 ? 'bold' : undefined))
            .text(d => d)
            .on('mouseover', (_, idx) => {
                activeColumn = idx;
                redrawTds();
            });

    table
        .append('tbody')
        .selectAll('tr')
        .data(tableData)
        .enter()
        .append('tr')
        .style('background-color', (d, i) => (i % 2 ? '#ebf1f5' : '#fff'))
        .on('mouseover', (_, idx) => {
            activeRow = idx;
            redrawTrs();
        })
        .selectAll('td')
        .data(d => d)
        .enter()
        .call(processTds);
};

export class Tables extends React.Component {
    draw = () => {
        makeTable(data, this.containerRef, {
            className: styles.table,
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
)(Tables);
