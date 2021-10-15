export const isObjectLike = function (value) {
    return typeof value === 'object' && value !== null;
};

const proto = {
    add(className) {
        if (typeof className === 'string') {
            this[className] = true;
        } else {
            Object.assign(this, className);
        }
        return this;
    },
    invert() {
        Object.keys(this).forEach((key) => {
            this[key] = !this[key];
        });
        return this;
    },
    toString() {
        return Object.keys(this)
            .filter((key) => this[key])
            .join(' ');
    },
};

export const classSet = function (config) {
    if (typeof config === 'string') {
        const key = config;
        config = {};
        config[key] = true;
    }
    return Object.assign(Object.create(proto), config);
};

export const clamp = function (num, min, max) {
    return num <= min ? min : num >= max ? max : num;
};

/**
 * Tests if the value passed in is a value greater than 0
 * @param {Integer} value - value to test
 * @returns {Boolean} - true if value is > 0
 */
export const isPositiveInteger = function (value) {
    return /^[0-9]*[1-9][0-9]*$/.test(value);
};

/**
 * Tests if the value passed in is 0 or a number greater than 0
 * @param {Integer} value - value to test
 * @returns {Boolean} - true if value is >= 0
 */
export const isNonNegativeInteger = function (value) {
    return /^\d+$/.test(value);
};

/**
 * Accepts a value which may be an Integer or String and tests that value
 * with respect to the numberType:
 *     a. numberType - positive: if value > 0
 *     b. numberType - non-negative: if value >= 0
 * If the value fails the test, the fallback value is returned
 *
 * @param {String} attrName - name of attribute to normalize
 * @param {Integer/String} value - value to normalize
 * @param {String} numberType - number type to validate against: positive / non-negative
 * @param {Integer} fallback - value to return if validation fails
 * @returns {Integer} - Returns normalized value if validation passes; else returns fallback
 */
export function normalizeNumberAttribute(
    attrName,
    value,
    numberType,
    fallback
) {
    let warningMessage;
    if (numberType === 'positive') {
        if (isPositiveInteger(value)) {
            return parseInt(value, 10);
        }

        warningMessage = `The attribute "${attrName}" value passed in is incorrect.
        "${attrName}" value should be an integer > 0.`;
    } else if (numberType === 'non-negative') {
        if (isNonNegativeInteger(value)) {
            return parseInt(value, 10);
        }

        warningMessage = `The attribute "${attrName}" value passed in is incorrect.
        "${attrName}" value should be an integer >= 0.`;
    } else {
        warningMessage =
            'Invalid number type during normalization of number attribute';
    }
    // eslint-disable-next-line no-console
    console.warn(warningMessage);
    return fallback;
}

// TODO: move into scroller-specific utility when more scroll-related functionality
// needs to be shared between libraries
/**
 * Utility for calculating the scroll offset
 * @param {HTMLElement} el - target element of the scroll
 */
export function getScrollOffsetFromTableEnd(el) {
    return (
        el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight
    );
}
