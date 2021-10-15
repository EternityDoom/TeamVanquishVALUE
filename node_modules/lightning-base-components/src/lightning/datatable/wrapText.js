import labelClipText from '@salesforce/label/LightningDatatable.clipText';
import labelWrapText from '@salesforce/label/LightningDatatable.wrapText';
import { getStateColumnIndex, getColumns } from './columns';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { normalizeNumberAttribute } from './utils';

const nonWrapableTypes = [
    'action',
    'boolean',
    'button',
    'button-icon',
    'date-local',
    'rowNumber',
];

const WRAP_TEXT_DEFAULT = false;

const i18n = {
    clipText: labelClipText,
    wrapText: labelWrapText,
};

function isWrapableType(type) {
    return nonWrapableTypes.indexOf(type) < 0;
}

export function setWrapTextMaxLines(state, value) {
    state.wrapTextMaxLines = normalizeNumberAttribute(
        'wrapTextMaxLines',
        value,
        'positive',
        undefined
    );
}

function updateWrapTextAndMaxLinesValuesInCells(state, colIndex, colKeyValue) {
    state.rows.forEach((row) => {
        const cell = row.cells[colIndex];
        cell.wrapText = state.wrapText[colKeyValue];
        cell.wrapTextMaxLines = cell.wrapText
            ? state.wrapTextMaxLines
            : undefined;
    });
}

function updateSelectedOptionInHeaderActions(state, colKeyValue) {
    const columns = getColumns(state);
    const colIndex = getStateColumnIndex(state, colKeyValue);
    const colData = columns[colIndex];

    colData.actions.internalActions.forEach((action) => {
        if (action.name === 'wrapText') {
            action.checked = state.wrapText[colKeyValue];
        }
        if (action.name === 'clipText') {
            action.checked = !state.wrapText[colKeyValue];
        }
    });

    updateWrapTextAndMaxLinesValuesInCells(state, colIndex, colKeyValue);

    // lets force a refresh on this column, because the wrapText checked value changed.
    colData.actions = Object.assign({}, colData.actions);
}

export function getWrapTextState(state = getDefaultState(), colKeyValue) {
    return state.wrapText[colKeyValue] || WRAP_TEXT_DEFAULT;
}

export function setWrapTextState(state = getDefaultState(), columnDefinition) {
    const { colKeyValue, type, wrapText } = columnDefinition;

    if (isWrapableType(type)) {
        state.wrapText[colKeyValue] =
            normalizeBoolean(wrapText) || WRAP_TEXT_DEFAULT;
    }
}

export function getActions(state, columnDefinition) {
    const wrapTextActions = [];
    const { hideDefaultActions, type, colKeyValue } = columnDefinition;

    // must be done first, so getWrapTextState correctly resolves
    setWrapTextState(state, columnDefinition);

    // if not hidden and isWrapable, sets the internal actions
    if (isWrapableType(type) && !hideDefaultActions) {
        const isTextWrapped = getWrapTextState(state, colKeyValue);

        wrapTextActions.push({
            label: `${i18n.wrapText}`,
            title: `${i18n.wrapText}`,
            checked: isTextWrapped,
            name: 'wrapText',
        });

        wrapTextActions.push({
            label: `${i18n.clipText}`,
            title: `${i18n.clipText}`,
            checked: !isTextWrapped,
            name: 'clipText',
        });
    }

    return wrapTextActions;
}

export function handleTriggeredAction(state, action, colKeyValue) {
    if (action.name === 'wrapText' || action.name === 'clipText') {
        // If will change state
        if (state.wrapText[colKeyValue] !== (action.name === 'wrapText')) {
            state.wrapText[colKeyValue] = action.name === 'wrapText';

            updateSelectedOptionInHeaderActions(state, colKeyValue);
        }
    }
}

export function getDefaultState() {
    return {
        wrapText: {},
    };
}
