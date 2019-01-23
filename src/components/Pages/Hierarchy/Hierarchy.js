/* eslint-disable indent,prefer-destructuring,no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
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

        const westerosChart = chartFactory(this.containerRef, {
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            padding: { top: 10, right: 10, bottom: 10, left: 10 },
        });

        westerosChart.loadData = async function(url) {
            if (url.match(/\.csv$/)) {
                this.data = d3.csvParse(await (await fetch(url)).text());
            } else if (url.match(/\.json$/)) {
                this.data = await (await fetch(url)).json();
            }

            return this.data;
        };

        westerosChart.init = function(chartType, dataUrl, ...args) {
            this.loadData(dataUrl).then(data => this[chartType].call(this, data, ...args));

            this.innerHeight =
                this.height - this.margin.top - this.margin.bottom - this.padding.top - this.padding.bottom;

            this.innerWeight =
                this.width - this.margin.left - this.margin.right - this.padding.left - this.padding.right;
        };

        westerosChart.tree = function(_data) {
            // const data = getMajorHouses(_data);
            const data = _data;
            const chart = this.container;
            const stratify = d3
                .stratify()
                .parentId(d => d.fatherLabel)
                .id(d => d.itemLabel);

            const root = stratify(data);
            const layout = d3.tree().size([this.innerWeight, this.innerHeight]);
        };
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
