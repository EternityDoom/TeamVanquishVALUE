/* eslint-disable @lwc/lwc/no-api-reassignments */

import labelRequired from '@salesforce/label/LightningControl.required';
import locale from '@salesforce/i18n/locale';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    classListMutation,
} from 'lightning/utilsPrivate';
import {
    isEmptyString,
    FieldConstraintApi,
    InteractingState,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';
import { getInputOrder, getRequiredFields } from './addressFormat';
import {
    getFieldWidth,
    getFieldWidthClass,
    getTransformedFieldsMetaForLayout,
} from './fieldsLayout';

const FIELD_TYPE = {
    TEXTAREA: 'textarea',
    INPUT: 'input',
    PICKLIST: 'combobox',
};

const i18n = {
    required: labelRequired,
};
/**
 * Represents an address compound field.
 */
export default class LightningInputAddress extends LightningElement {
    static delegatesFocus = true;

    /**
     * The label for the address compound field.
     * @type {string}
     */
    @api addressLabel;

    /**
     * The label for the street field.
     * @type {string}
     */
    @api streetLabel;

    /**
     * The label for the city field.
     * @type {string}
     */
    @api cityLabel;

    /**
     * The label for the province field.
     * @type {string}
     */
    @api provinceLabel;

    /**
     * The label for the country field.
     * @type {string}
     */
    @api countryLabel;

    /**
     * The label for the postal code field.
     * @type {string}
     */
    @api postalCodeLabel;

    /**
     * The placeholder for the street field.
     * @type {string}
     */
    @api streetPlaceholder;

    /**
     * The placeholder for the city field.
     * @type {string}
     */
    @api cityPlaceholder;

    /**
     * The placeholder for the province field.
     * @type {string}
     */
    @api provincePlaceholder;

    /**
     * The placeholder for the country field.
     * @type {string}
     */
    @api countryPlaceholder;

    /**
     * The placeholder for the postal code field.
     * @type {string}
     */
    @api postalCodePlaceholder;

    /**
     * The placeholder for the address lookup field option.
     * Visible only when using show-address-lookup.
     * @type {string}
     */
    @api addressLookupPlaceholder;

    /**
     * The array of label-value pairs for the province. Displays a dropdown menu of options.
     * @type {list}
     */
    @api provinceOptions;

    /**
     * The array of label-value pairs for the country. Displays a dropdown menu of options.
     * @type {list}
     */
    @api countryOptions;

    /**
     * If present, the country field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api countryDisabled;

    @track _showAddressLookup;
    @track _fieldLevelHelp;
    @track _variant;
    @track _street = '';
    @track _city = '';
    @track _province = '';
    @track _country = '';
    @track _postalCode = '';
    @track _disabled = false;
    @track _readonly = false;
    @track _required = false;

    connectedCallback() {
        this._connected = true;

        this.classList.add('slds-form-element', 'slds-form_compound');
        this.updateClassList();
        this.interactingState = new InteractingState({
            debounceInteraction: true,
        });
        this.interactingState.onenter(() => {
            this.dispatchEvent(new CustomEvent('focus'));
        });
        this.interactingState.onleave(() => {
            this.reportValidity();
            this.dispatchEvent(new CustomEvent('blur'));
        });
    }

    updateClassList() {
        classListMutation(this.classList, {
            'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
            'slds-form-element_horizontal':
                this.variant === VARIANT.LABEL_INLINE,
        });
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * The value for the street field.
     * Maximum length is 255 characters.
     * @type {string}
     *
     */
    @api
    get street() {
        return this._street;
    }
    set street(value) {
        this._street = value;
    }

    /**
     * The value for the city field.
     * Maximum length is 40 characters.
     * @type {string}
     *
     */
    @api
    get city() {
        return this._city;
    }
    set city(value) {
        this._city = value;
    }

    /**
     * The province field for the address. If province-options is provided, this province value is selected by default.
     * Maximum length is 80 characters.
     * @type {string}
     *
     */
    @api
    get province() {
        return this._province;
    }
    set province(value) {
        this._province = value;
    }

    /**
     * The country field for the address. If country-options is provided, this country value is selected by default.
     * Maximum length is 80 characters.
     * @type {string}
     *
     */
    @api
    get country() {
        return this._country;
    }
    set country(value) {
        this._country = value;
    }

    /**
     * The value for postal code field.
     * Maximum length is 20 characters.
     * @type {string}
     *
     */
    @api
    get postalCode() {
        return this._postalCode;
    }
    set postalCode(value) {
        this._postalCode = value;
    }

    /**
     * If present, the address fields are disabled and users cannot interact with them.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * If present, address lookup using Google Maps is enabled.
     * @type {boolean}
     * @default false
     */
    @api
    get showAddressLookup() {
        return this._showAddressLookup;
    }
    set showAddressLookup(value) {
        this._showAddressLookup = normalizeBoolean(value);
    }

    /**
     * If present, the address fields are read-only and cannot be edited.
     * @type {boolean}
     * @default false
     */
    @api
    get readOnly() {
        return this._readonly;
    }
    set readOnly(value) {
        this._readonly = normalizeBoolean(value);
    }

    /**
     * If present, the address fields must be filled before the form is submitted.
     * @type {boolean}
     * @default false
     */
    @api
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = normalizeBoolean(value);
    }

    /**
     * The variant changes the appearance of an input address field.
     * Accepted variants include standard, label-hidden, label-inline, and label-stacked.
     * This value defaults to standard.
     * Use label-hidden to hide the compound field label but make it available to assistive technology.
     * Use label-inline to horizontally align the label and input address field.
     * Use label-stacked to place the label above the input address field.
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
        this.updateClassList();
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    /**
     * Help text detailing the purpose and function of the input.
     * @type {string}
     *
     */
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     *
     */
    @api
    get validity() {
        return this._combinedConstraint.validity;
    }

    /**
     * Checks if the input is valid.
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._combinedConstraint.checkValidity();
    }

    /**
     * Displays error messages on the address fields if the values are invalid.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    /**
     * Sets a custom error message to be displayed for the specified fieldName when
     * the input address value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     * @param {string} fieldName - Name of the field, which must be one of the following: street, city, province, postalCode, country.
     */
    @api
    setCustomValidityForField(message, fieldName) {
        assert(
            this.fieldsMeta[fieldName] !== undefined,
            `Invalid 'fieldName': ${fieldName}`
        );
        this._fieldConstraints[fieldName].setCustomValidity(message);
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    @api
    reportValidity() {
        const valid = this.checkValidity();

        if (!this._connected) {
            return valid;
        }
        this.inputOrder.forEach((field) => {
            this._reportValidityForField(field);
        });

        return valid;
    }

    /**
     * Sets focus on the first input element.
     */
    @api
    focus() {
        this.template.querySelector('[data-field]').focus();
    }

    /**
     * Removes focus from all input fields.
     */
    @api
    blur() {
        Array.prototype.forEach.call(
            this.template.querySelectorAll('[data-field]'),
            (field) => field.blur()
        );
    }

    get searchAddressButtonDisabled() {
        return this.disabled || this.readOnly;
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLegendClass() {
        return classSet('slds-form-element__label slds-form-element__legend')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get fieldsTypeMeta() {
        return {
            street: {
                // See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
                // for autocomplete attributes
                autocomplete: 'street-address',
                name: 'street',
                maxlength: 255,
                type: FIELD_TYPE.TEXTAREA,
            },
            city: {
                autocomplete: 'address-level2',
                name: 'city',
                maxlength: 40,
                type: FIELD_TYPE.INPUT,
            },
            province: {
                autocomplete: 'address-level1',
                name: 'province',
                maxlength: 80,
                type: this.isProvincePicklistEnabled()
                    ? FIELD_TYPE.PICKLIST
                    : FIELD_TYPE.INPUT,
            },
            postalCode: {
                autocomplete: 'postal-code',
                name: 'postalCode',
                maxlength: 20,
                type: FIELD_TYPE.INPUT,
            },
            country: {
                autocomplete: 'country',
                name: 'country',
                maxlength: 80,
                type: this.isCountryPicklistEnabled()
                    ? FIELD_TYPE.PICKLIST
                    : FIELD_TYPE.INPUT,
            },
        };
    }

    get inputOrder() {
        const hasCountryPicklist =
            this.fieldsTypeMeta.country.type === FIELD_TYPE.PICKLIST;
        const [langCode, countryCode] = locale.split('-');
        return getInputOrder(langCode, countryCode, hasCountryPicklist);
    }

    get requiredFields() {
        const [langCode, countryCode] = locale.split('-');
        return getRequiredFields(langCode, countryCode);
    }

    get fieldsMeta() {
        const fieldsMeta = {};
        this.inputOrder.forEach((name) => {
            fieldsMeta[name] = Object.assign(
                {},
                this.fieldsTypeMeta[name],
                getFieldWidth(name)
            );
        });
        this.requiredFields.forEach((name) => {
            fieldsMeta[name].required = true;
        });
        return fieldsMeta;
    }

    get domFieldsMeta() {
        let rowKey = 0;
        const out = getTransformedFieldsMetaForLayout(
            this.fieldsMeta,
            this.inputOrder
        ).map((row) => {
            const rowList = row.map((field) => {
                const { name, type, required, maxlength, autocomplete } = field;
                const widthClass = getFieldWidthClass(field);

                return {
                    isInput: type === FIELD_TYPE.INPUT,
                    isPicklist: type === FIELD_TYPE.PICKLIST,
                    isTextArea: type === FIELD_TYPE.TEXTAREA,
                    value: this.getFieldValue(name),
                    options: this.getFieldOptions(name),
                    required: this.required && !!required,
                    disabled: this.getFieldDisabled(name) || this.disabled,
                    classnames: `slds-form-element slds-show ${widthClass}`,
                    placeholder: this.getFieldPlaceholder(name),
                    label: this.getFieldLabel(name),
                    autocomplete,
                    maxlength,
                    name,
                };
            });
            rowList.name = rowKey++;
            return rowList;
        });

        return out;
    }

    isCountryPicklistEnabled() {
        return Array.isArray(this.countryOptions);
    }

    isProvincePicklistEnabled() {
        return Array.isArray(this.provinceOptions);
    }

    handleAddress(evt) {
        const address = evt.detail.address || {};

        this.street = address.street || '';
        this.city = address.city || '';
        this.province = address.state || '';

        const country = this.isCountryPicklistEnabled()
            ? address.countryCode
            : address.country;
        this.country = country || '';

        this.postalCode = address.postalCode || '';

        this.dispatchAddressChangeEvent();
    }

    handleFocus() {
        this.interactingState.enter();
    }

    handleBlur(event) {
        this.interactingState.leave();

        const field = event.target.dataset.field;
        this._reportValidityForField(field);
    }

    handleChange(event) {
        event.stopPropagation();

        const fieldName = event.target.dataset.field;
        const value = event.detail.value;
        if (this.getFieldValue(fieldName) === value) {
            // Value didn't change. No need to dispatch.
            return;
        }

        this[fieldName] = value;

        this.dispatchAddressChangeEvent();
    }

    dispatchAddressChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    street: this.street,
                    city: this.city,
                    province: this.province,
                    country: this.country,
                    postalCode: this.postalCode,
                    validity: this.validity,
                },
            })
        );
    }

    getFieldValue(fieldName) {
        return this[fieldName];
    }

    getFieldOptions(fieldName) {
        return this[`${fieldName}Options`];
    }

    getFieldLabel(fieldName) {
        return this[`${fieldName}Label`];
    }

    getFieldPlaceholder(fieldName) {
        return this[`${fieldName}Placeholder`];
    }

    getFieldDisabled(fieldName) {
        return !!this[`${fieldName}Disabled`];
    }

    getFieldElement(fieldName) {
        return this.template.querySelector(`[data-field="${fieldName}"]`);
    }

    get _fieldConstraints() {
        if (!this._fieldConstraintApis) {
            // For every field to display create an appropriate constraint
            this._fieldConstraintApis = [
                'street',
                'city',
                'province',
                'country',
                'postalCode',
            ].reduce((constraints, field) => {
                constraints[field] = new FieldConstraintApi(
                    () => this.getFieldElement(field),
                    {
                        valueMissing: () =>
                            !this.disabled &&
                            this.required &&
                            this.requiredFields.indexOf(field) >= 0 &&
                            isEmptyString(this[field]),
                    }
                );
                return constraints;
            }, {});
        }
        return this._fieldConstraintApis;
    }

    get _combinedConstraint() {
        if (!this._combinedConstraintApi) {
            this._combinedConstraintApi = new FieldConstraintApi(() => this, {
                customError: () =>
                    Object.values(this._fieldConstraints).some(
                        (constraint) => constraint.validity.customError
                    ),
                valueMissing: () =>
                    Object.values(this._fieldConstraints).some(
                        (constraint) => constraint.validity.valueMissing
                    ),
            });
        }
        return this._combinedConstraintApi;
    }

    _reportValidityForField(field) {
        if (this._fieldConstraints[field]) {
            this._fieldConstraints[field].reportValidity((helpMessage) => {
                const fieldElement = this.getFieldElement(field);
                fieldElement.setCustomValidity(helpMessage);
                fieldElement.reportValidity();
            });
        }
    }
}
