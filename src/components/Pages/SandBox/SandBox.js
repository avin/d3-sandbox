import React from 'react';
import { connect } from 'react-redux';

export class SandBox extends React.Component {
    componentDidMount() {}

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
