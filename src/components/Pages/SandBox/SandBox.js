import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

export class SandBox extends React.Component {
    componentDidMount() {
        window.d3 = d3;
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
)(SandBox);
