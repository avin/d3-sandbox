import get from 'lodash/get';

export const randomArrayElement = arr => arr[Math.floor(Math.random() * arr.length)];

const generateAroundMatrix = () => {
    const result = [];
    for (let y = -1; y <= 1; y += 1) {
        for (let x = -1; x <= 1; x += 1) {
            if (!(x === 0 && y === 0)) {
                result.push([y, x]);
            }
        }
    }
    return result;
};
export const aroundMatrix = generateAroundMatrix();

export const countAround = ({ matrix, y, x, width, height }) => {
    let aroundCount = 0;
    const aroundColors = [];
    aroundMatrix.forEach(([yd, xd]) => {
        let ry = y + yd;
        let rx = x + xd;

        if (ry === -1) {
            ry = height - 1;
        }
        if (ry === height) {
            ry = 0;
        }
        if (rx === -1) {
            rx = width - 1;
        }
        if (rx === width) {
            rx = 0;
        }

        const color = get(matrix, [ry, rx]);
        if (color) {
            aroundCount += 1;
            aroundColors.push(color);
        }
    });

    return [aroundCount, aroundColors];
};
