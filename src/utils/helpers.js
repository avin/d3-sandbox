/* eslint-disable prefer-template */
import shuffle from 'lodash/shuffle';
import range from 'lodash/range';

export function makeKey(x, y) {
    return `${x}_${y}`;
}

export function mixColors(colors) {
    const count = colors.length;

    if (!count) {
        // ???
        throw new Error('no colors??');
    }

    switch (count) {
        case 1:
            return colors[0];
        case 2: {
            const nums = shuffle(range(0, 2));
            return '#' + colors[nums[0]].slice(1, 4) + colors[nums[1]].slice(4, 7);
        }

        case 3: {
            const nums = shuffle(range(0, 3));
            return '#' + colors[nums[0]].slice(1, 3) + colors[nums[1]].slice(3, 5) + colors[nums[2]].slice(5, 7);
        }

        case 4: {
            const nums = shuffle(range(0, 4));
            return (
                '#' +
                colors[nums[0]].slice(1, 3) +
                colors[nums[1]].slice(3, 5) +
                colors[nums[2]].slice(5, 6) +
                colors[nums[3]].slice(6, 7)
            );
        }

        case 5: {
            const nums = shuffle(range(0, 5));
            return (
                '#' +
                colors[nums[0]].slice(1, 3) +
                colors[nums[1]].slice(3, 4) +
                colors[nums[4]].slice(4, 5) +
                colors[nums[2]].slice(5, 6) +
                colors[nums[3]].slice(6, 7)
            );
        }

        default: {
            const nums = shuffle(range(0, 6));
            return (
                '#' +
                colors[nums[0]].slice(1, 2) +
                colors[nums[5]].slice(2, 3) +
                colors[nums[1]].slice(3, 4) +
                colors[nums[4]].slice(4, 5) +
                colors[nums[2]].slice(5, 6) +
                colors[nums[3]].slice(6, 7)
            );
        }
    }
}
