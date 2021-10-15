import { LightningElement, api } from 'lwc';
import { queryFocusable } from 'lightning/utils';

export default class PrimitiveCustomCell extends LightningElement {
    @api types;
    @api columnType;
    @api value;
    @api editable;
    @api columnLabel;
    @api rowKeyValue;
    @api colKeyValue;
    @api columnSubType;
    @api typeAttribute0;
    @api typeAttribute1;
    @api typeAttribute2;
    @api typeAttribute3;
    @api typeAttribute4;
    @api typeAttribute5;
    @api typeAttribute6;
    @api typeAttribute7;
    @api typeAttribute8;
    @api typeAttribute9;
    @api typeAttribute10;
    // typeAttribute21 and typeAttribute21 used by treegrid
    @api typeAttribute21;
    @api typeAttribute22;
    @api internalTabIndex;
    @api keyboardMode;
    @api wrapText;
    @api alignment;

    get type() {
        const type = this.types.getType(this.columnType);
        return type.template;
    }

    render() {
        return this.type;
    }

    get typeAttributes() {
        const typeAttributes = this.types.getType(
            this.columnType
        ).typeAttributes;
        if (Array.isArray(typeAttributes)) {
            return typeAttributes.reduce((seed, attrName, index) => {
                seed[attrName] = this[`typeAttribute${index}`];
                return seed;
            }, {});
        }
        return {};
    }

    @api
    getActionableElements() {
        return queryFocusable(this.template);
    }
}
