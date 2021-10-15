import { unwrap } from 'lwc';
import { getUserColumnIndex, getColumns } from './columns';
import * as wraptext from './wrapText';

function handleTriggeredInternalAction(dt, action, colKeyValue) {
    wraptext.handleTriggeredAction(dt.state, action, colKeyValue);
    dispatchHeaderActionEvent(dt, action, colKeyValue);
}

function handleTriggeredCustomerAction(dt, action, colKeyValue) {
    dispatchHeaderActionEvent(dt, action, colKeyValue);
}

function dispatchHeaderActionEvent(dt, action, colKeyValue) {
    const userColumnIndex = getUserColumnIndex(dt.state, colKeyValue);
    const customerColumnDefinition = dt.columns[userColumnIndex];

    dt.dispatchEvent(
        new CustomEvent('headeraction', {
            detail: {
                action: unwrap(action),
                columnDefinition: unwrap(customerColumnDefinition),
            },
        })
    );
}

function getMenuAlignment(columns, index) {
    const isLastColumn = index === columns.length - 1;

    return isLastColumn || columns[index + 1].type === 'action'
        ? 'auto-right'
        : 'auto-left';
}

export function getInternalActions(state, columnDefinition) {
    // merge all internal actions here
    // currently, only wrapText internal actions
    // there may be new internal actions in the future
    return [...wraptext.getActions(state, columnDefinition)];
}

/**
 * Overrides the actions with the internal ones, plus the customer ones.
 *
 * @param {Object} state The state of the datatable.
 */
export function updateHeaderActions(state) {
    const columns = getColumns(state);

    columns.forEach((column, idx) => {
        column.actions = {
            menuAlignment: getMenuAlignment(columns, idx),
            customerActions: Array.isArray(column.actions)
                ? column.actions
                : [],
            internalActions: getInternalActions(state, column),
        };
    });
}

export function handleHeaderActionTriggered(event) {
    const { action, actionType, colKeyValue } = event.detail;

    event.stopPropagation();
    if (actionType === 'customer') {
        handleTriggeredCustomerAction(this, action, colKeyValue);
    } else {
        handleTriggeredInternalAction(this, action, colKeyValue);
    }
}

export function getColumnActionsDefaultState() {
    return Object.assign({}, wraptext.getDefaultState());
}

// in rem, the height of a clickable menu item
const ACTION_HEIGHT = 2.125;
// 1 rem + 1px (1/16px), height of the menu divider
const DIVIDER_HEIGHT = 1.0625;

export function handleHeaderActionMenuOpening(event) {
    event.stopPropagation();
    event.preventDefault();
    const actionsHeight = event.detail.actionsCount * ACTION_HEIGHT;
    const dividersHeight = event.detail.dividersCount * DIVIDER_HEIGHT;
    const wrapperHeight = 1;
    this._actionsMinHeightStyle = `min-height:${
        actionsHeight + dividersHeight + wrapperHeight
    }rem`;
    event.detail.saveContainerPosition(this.getViewableRect());
}

export function handleHeaderActionMenuClosed() {
    this._actionsMinHeightStyle = '';
}
