import * as d3 from 'd3';

const protoChart = {
    width: window.innerWidth,
    height: window.innerHeight,
    margin: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
    },
};

export default function chartFactory(domNode, opts = {}, proto = protoChart) {
    const chart = { ...proto, ...opts };

    chart.svg = d3
        .select(domNode)
        .append('svg')
        .attr('id', chart.id || 'chart')
        .attr('width', chart.width - chart.margin.right)
        .attr('height', chart.height - chart.margin.bottom);

    chart.container = chart.svg
        .append('g')
        .attr('id', 'container')
        .attr('transform', `translate(${chart.margin.left}, ${chart.margin.top})`);

    return chart;
}

export const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

export const heightValueComparator = (a, b) => b.height - a.height || b.value - a.value;

export const valueComparator = (a, b) => b.value - a.value;

export function uniques(data, name) {
    return data
        .reduce((uniqueValues, d) => {
            uniqueValues.push(uniqueValues.indexOf(name(d)) < 0 ? name(d) : undefined);

            return uniqueValues;
        }, [])
        .filter(i => i); // Filter by identity
}

export function fixateColors(data, key) {
    colorScale.domain(uniques(data, d => d[key]));
}

export const addRoot = (data, itemKey, parentKey, joinValue) => {
    data.forEach(d => {
        d[parentKey] = d[parentKey] || joinValue;
    });

    data.push({
        [parentKey]: '',
        [itemKey]: joinValue,
    });

    return data;
};

export const tooltip = () => {};

export const descendantsDarker = () => {};
