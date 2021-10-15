---
examples:
    - name: base
      label: Basic Address Input
      description: Address fields can be prepopulated and marked as required.
    - name: stateAndCountryPicklists
      label: Address With State and Country Picklists
      description: Address fields support predefined lists of states and countries.
---

A `lightning-input-address` component creates a compound field that includes the following constituent fields.

-   Street
-   City
-   Province
-   Country
-   Postal code

The street field is displayed as a multi-line text field. The other fields are displayed as a text input field by default. The country and province fields are displayed as dropdown menus if you specify `country-options` and `province-options` to provide options for menu items.

This example creates an address compound field with attributes to specify values for the constituent fields. The initial values are set directly with the attributes.

```html
<template>
    <div>
        <lightning-input-address
            address-label="Address"
            street-label="Street"
            city-label="City"
            country-label="Country"
            province-label="State"
            postal-code-label="PostalCode"
            street="1 Market St."
            city="San Francisco"
            country="US"
            province="CA"
            postal-code="94105"
            field-level-help="Enter your billing address"
        >
        </lightning-input-address>
    </div>
</template>
```

`lightning-input-address` uses the `onchange` event handler to listen to a change to its field values.

```html
<p>You are located in: {city}</p>
    <lightning-input-address
        address-label="Address"
        street-label="Street"
        city-label="City"
        country-label="Country"
        province-label="Province"
        postal-code-label="PostalCode"
        city={city}
        onchange={handleChange} ></lightning-input-address>
```

To bind the input value on the address fields, use the `event.target` property. 

```js
import { LightningElement } from 'lwc';

export default class AddressCityExample extends LightningElement {
    city = "San Francisco";

    handleChange(event) {
        this.city = event.target.city;
    }
}
```

See the __Custom Events__ section for a list of `event.target` properties. For more information, see [Data Binding in a Template](docs/component-library/documentation/en/lwc/js_props_getter).

#### Creating Dropdown Menus for Country and Province

To create a dropdown menu for the country and province, pass in an array of
label-value pairs to `country-options` and `province-options`. Use the `country` and
`province` attributes to specify the default values on the dropdown menus.

```html
<template>
    <div>
        <lightning-input-address
            address-label="Address"
            street-label="Street"
            city-label="City"
            country-label="Country"
            province-label="Province/State"
            postal-code-label="PostalCode"
            street="1 Market St."
            city="San Francisco"
            province="CA"
            country="US"
            country-options="{getCountryOptions}"
            province-options="{getProvinceOptions}"
            postal-code="94105"
            required
            onchange="{handleChange}"
        >
        </lightning-input-address>
    </div>
</template>
```

JavaScript file:

```javascript
import { LightningElement } from 'lwc';

export default class DemoInputAddress extends LightningElement {
    provinceOptions = [
        { label: 'California', value: 'CA' },
        { label: 'Texas', value: 'TX' },
        { label: 'Washington', value: 'WA' },
    ];

    countryOptions = [
        { label: 'United States', value: 'US' },
        { label: 'Japan', value: 'JP' },
        { label: 'China', value: 'CN' },
    ];

    get getProvinceOptions() {
        return this.countryProvinceMap[this._country];
    }
    get getCountryOptions() {
        return this.countryOptions;
    }

    handleChange(event) {
        this._country = event.detail.country;
    }
}
```

Alternatively, you can enable state and country picklists in your org, and
access the values by using a wire adapter.
See [Let Users Select State and Country from Picklists](https://help.salesforce.com/articleView?id=admin_state_country_picklists_overview.htm) in Salesforce Help and [getPicklistValues](docs/component-library/documentation/lwc/reference_wire_adapters_picklist_values) in the Lightning Web Components Developer Guide.

#### Using Lookup to Find and Autofill an Address

To enable autocompletion of the address fields using an address lookup field, include the `show-address-lookup` attribute. The address lookup field is placed above the address fields you provide.

```html
<template>
    <lightning-input-address
        address-label="Address"
        street-label="Street"
        city-label="City"
        country-label="Country"
        province-label="State"
        postal-code-label="Zip Code"
        street="1 Market St."
        city="San Francisco"
        country="US"
        province="CA"
        show-address-lookup
    >
    </lightning-input-address>
</template>
```

When you start typing an address in the lookup field, a dropdown menu displays matching addresses returned by the Google Maps Places API. Select an address from the dropdown to populate the address fields.

#### Validating Required Fields

When you set `required`, a red asterisk is displayed on every address
field to indicate that an entry in each field is required. An error message is displayed below
a field if a user interacted with it and left it blank. The `required`
attribute is not enforced and you must validate it before submitting a form
that contains an address compound field.

Let's say you have a `lightning-button` component that calls the `handleClick`
function. You can display the error message when a user clicks the
button without providing a value on a field.

```javascript
    handleClick(e) {
        const address =
            this.template.querySelector('lightning-input-address');
        const isValid = address.checkValidity();
        if(isValid) {
            alert("Creating a new address");
        } else {
            alert("Complete all address fields");
        }
    }
```

#### Working with Labels and Placeholders

A label is associated with an address field and it enables screen readers to navigate the form correctly. Include a label for each field you're using, with the following attributes.

-   `address-label`
-   `street-label`
-   `city-label`
-   `province-label`
-   `country-label`
-   `postal-code-label`

You can hide the `address-label` visually and still make them accessible to screen readers by using `variant="label-hidden"`.

Additionally, the `show-address-lookup` boolean attribute creates a search field that doesn't have an associated label. See **Using Lookup to Find and Autofill an Address** for more information.

Your Salesforce locale setting determines the order and layout of the address fields.

You can also use custom labels that display translated values. For more information, see
[Access Labels](docs/component-library/documentation/lwc/lwc.create_labels).

We recommend that you provide a label even when you provide placeholder text for an address field. Without field labels, users can lose context when the placeholder text disappears as they type in the field.

Specify placeholder text to give users a hint about the content they're expected to enter in the field. Avoid repeating the field label in the placeholder for better accessibility. Consider the width of your address field as the placeholder text is cut off if it's too long, especially on mobile devices.

Include an optional placeholder for each field you're using, with the following attributes.

-   `address-lookup-placeholder`
-   `street-placeholder`
-   `city-placeholder`
-   `province-placeholder`
-   `country-placeholder`
-   `postal-code-placeholder`

#### Component Styling

`lightning-input-address` implements the
[form element](https://lightningdesignsystem.com/components/form-element/#Address) address blueprint in the
Salesforce Lightning Design System (SLDS).

You can use a combination of the `variant` and `class` attributes to customize the address fields.

##### Variants

Use the `variant` attribute with one of these values to apply different label positioning.

-   `label-hidden` hides the compound field label but make it available to assistive technology. This variant does not hide the constituent field labels.
-   `label-inline` horizontally aligns the compound field label and address fields.
-   `label-stacked` places the label above the address fields.
-   `standard` is the default value, which displays the label above the address fields.

##### Customize Component Styling

To apply additional styling, use the SLDS [utility classes](https://www.lightningdesignsystem.com/utilities/alignment) with the `class` attribute.

This example adds padding on top of address fields using an SLDS class.

```html
<lightning-input-address
    class="slds-p-top_small"
    address-label="Address"
    street-label="Street"
    city-label="City"
    country-label="Country"
    province-label="Province"
    postal-code-label="PostalCode"
>
</lightning-input-address>
```

To apply custom styling, use the `:host` selector. Use SLDS styling hooks to customize the component's styles. The Street field renders a [textarea](https://www.lightningdesignsystem.com/components/textarea) and the other fields render [input](https://www.lightningdesignsystem.com/components/input/) fields.

For example, change the minimum height of the textarea and change the background color of the input fields.

```css
:host {
    --sds-c-textarea-sizing-min-height: 200px;
    --sds-c-input-color-background: orange;
}
```

See [Input: Styling Hooks Overview](https://www.lightningdesignsystem.com/components/input/#Styling-Hooks-Overview) and [Textarea: Styling Hooks Overview](https://www.lightningdesignsystem.com/components/textarea/#CSS-Class-Overview) for a list of CSS custom properties.

#### Usage Considerations

Using `show-address-lookup` is not supported in Playground, Experience Builder sites, Lightning Out,
Lightning Components for Visualforce, and standalone apps.

When working with address fields such as with the `MailingAddress` field on Salesforce records, consider using the record form components. The `lightning-record-form`, `lightning-record-view-form`, and `lightning-record-edit-form` components provide a form-based UI that's metadata-driven. The components are automatically wired up to your record data, labels, and field-level help text. For more information, see [Work with Records Using Base Components](docs/component-library/documentation/en/lwc/lwc.data_get_user_input_intro).

To create your own custom UI to work with Salesforce records, use `lightning-input-address` with the `lightning/ui*Api` wire adapters and functions, such as `getRecord` and `updateRecord`. For more information, see [Use the Wire Service with Base Components](docs/component-library/documentation/en/lwc/lwc.data_wire_base_components).

To disable the fields so that users cannot interact with it, use the `disabled` attribute. If you want to prevent users from interacting with the country field only,
disable it using the `country-disabled` attribute.

#### Accessibility

You must provide a text label for accessibility to make the information available to assistive technology.
The `label` attribute creates an HTML `<label>` element for your address.
To hide the compound field label from view and make it available to assistive technology, use the `label-hidden` variant.
This variant keeps the constituent field labels in view.

#### Custom Events

**`change`**

The event fired when an item is changed in the `lightning-input-address` component.

The `change` event returns the following parameters.

| Parameter  | Type   | Description                        |
| ---------- | ------ | ---------------------------------- |
| street     | string | The number and name of street.     |
| city       | string | The name of the city.              |
| province   | string | The name of the province/state.    |
| country    | string | The name of the country.           |
| postalCode | string | The postal code for the address.   |
| validity   | object | The validity state of the element. |

The `change` event properties are as follows.

| Property   | Value | Description                                                                                               |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------- |
| bubbles    | true  | This event bubbles up through the DOM.                                                                    |
| cancelable | false | This event has no default behavior that can be canceled. You can't call `preventDefault()` on this event. |
| composed   | true  | This event propagates outside of the component in which it was dispatched.                                |
