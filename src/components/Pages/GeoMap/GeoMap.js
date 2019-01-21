import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

export class GeoMap extends React.Component {
    scale = 150;
    center = [8, 1];

    draw = async () => {
        this.svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', 800)
            .attr('height', 500)
            .style('border', '1px solid black')
            .style('margin', '10px');

        this.svg.on('mousewheel', () => {
            const e = d3.event;
            e.preventDefault();
            if (e.wheelDelta > 0) {
                this.scale = Math.min(2500, this.scale + this.scale / 10);
            } else {
                this.scale = Math.max(50, this.scale - this.scale / 10);
            }
            this.redraw();
        });

        const proj = d3
            .geoEquirectangular()
            .center(this.center)
            .scale(this.scale);

        this.world = await fetch('data/countries.geo.json').then(d => d.json());

        this.sc = d3.scaleOrdinal(d3.schemeSet3);

        this.svg
            .selectAll('path')
            .data(this.world.features)
            .enter()
            .append('path')
            .attr('d', d3.geoPath().projection(proj))
            .attr('fill', (d, i) => this.sc(i));
    };

    redraw = () => {
        const proj = d3
            .geoEquirectangular()
            .center(this.center)
            .scale(this.scale);

        this.svg
            .selectAll('path')
            .data(this.world.features)
            .attr('d', d3.geoPath().projection(proj))
            .attr('fill', (d, i) => this.sc(i));
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
)(GeoMap);
