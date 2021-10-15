# lightning-base-components

Base Lightning web components are the building blocks of the modern user interfaces
for Lightning Experience, the Salesforce app, and Lightning Communities. The components
incorporate Lightning Design System markup and classes, providing improved performance
and accessibility with a minimum footprint.

The `lightning` namespace components are optimized for common use cases. They handle
accessibility, real-time interaction, and enhanced error messages.

## Installation

Install the `lightning-base-components` package in your project by running `yarn` or `npm install`.

```
// with npm
npm install lightning-base-components

// with yarn
yarn add lightning-base-components
```

## How to Use

app.js

```js
import { LightningElement } from 'lwc';

export default class FooApp extends LightningElement {
    clickedButtonLabel;

    handleClick(event) {
        this.clickedButtonLabel = event.target.label;
    }
}
```

app.html

```html
<template>
    <div class="slds-m-top_small slds-m-bottom_medium">
        <h2 class="slds-text-heading_small slds-m-bottom_small">
            Click the buttons to activate the <code>onclick</code> handler and
            view the label of the clicked button.
        </h2>

        <!-- Base variant: Makes a button look like a link -->
        <lightning-button
            variant="base"
            label="Base"
            title="Looks like a link"
            onclick="{handleClick}"
            class="slds-m-left_x-small"
        ></lightning-button>
    </div>
</template>
```

[![Edit happy-silence-pqqd8](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/happy-silence-pqqd8?fontsize=14&hidenavigation=1&theme=dark)

For more information on how to build a simple web app using the `lightning-base-components` npm package, see [Build Connected Apps Anywhere Using Lightning Base Components](https://developer.salesforce.com/blogs/2020/12/build-connected-apps-anywhere-using-lightning-base-components.html).

## Limitations

-   SLDS styles needs to be globally defined at application level.
-   @lwc/synthetic-shadow is required.

## What's Included

The npm package includes the base Lightning
web components that can run on the Salesforce platform or outside the Salesforce platform.

The npm package includes these components, along with any utilities and libraries they require.

-   lightning-accordion
-   lightning-accordion-section
-   lightning-avatar
-   lightning-badge
-   lightning-breadcrumb
-   lightning-breadcrumbs
-   lightning-button
-   lightning-button-group
-   lightning-button-icon
-   lightning-button-icon-stateful
-   lightning-button-menu
-   lightning-button-stateful
-   lightning-card
-   lightning-carousel
-   lightning-carousel-image
-   lightning-checkbox-group
-   lightning-combobox
-   lightning-datatable
-   lightning-dual-listbox
-   lightning-dynamic-icon
-   lightning-formatted-address
-   lightning-formatted-date-time
-   lightning-formatted-email
-   lightning-formatted-location
-   lightning-formatted-name
-   lightning-formatted-number
-   lightning-formatted-phone
-   lightning-formatted-rich-text
-   lightning-formatted-text
-   lightning-formatted-time
-   lightning-formatted-url
-   lightning-helptext
-   lightning-icon
-   lightning-input
-   lightning-input-address
-   lightning-input-location
-   lightning-input-name
-   lightning-layout
-   lightning-layout-item
-   lightning-menu-divider
-   lightning-menu-item
-   lightning-menu-subheader
-   lightning-navigation
-   lightning-pill
-   lightning-pill-container
-   lightning-progress-bar
-   lightning-progress-indicator
-   lightning-progress-ring
-   lightning-progress-step
-   lightning-radio-group
-   lightning-relative-date-time
-   lightning-slider
-   lightning-spinner
-   lightning-tab
-   lightning-tabset
-   lightning-textarea
-   lightning-tile
-   lightning-tree
-   lightning-tree-grid
-   lightning-vertical-navigation
-   lightning-vertical-navigation-item
-   lightning-vertical-navigation-item-badge
-   lightning-vertical-navigation-item-icon
-   lightning-vertical-navigation-overflow
-   lightning-vertical-navigation-section

Some components in the npm package are not yet supported for use by customers on the Salesforce platform. For example:

-   lightning-context
-   lightning-dialog
-   lightning-grouped-combobox
-   lightning-message-dispatcher
-   lightning-picklist
-   lightning-popup
-   lightning-select
-   lightning-stacked-tab
-   lightning-stacked-tabset

We are not currently accepting feature or bug fix requests for components that work only outside the Salesforce platform. Use these components in your projects outside the Salesforce platform at your own risk. Note that this is not an exhaustive list.

To see if a component can work only outside the Salesforce platform, check the `.js-meta.xml` config file in the component directory.
For example, `lightning-dialog` is not supported on the Salesforce platform, and `dialog.js-meta.xml` includes only the following tag:

```xml
<isExposed>true</isExposed>
```

Contrastingly, a component that's supported outside and on the Salesforce platform includes the `isExposed`, `minApiVersion`, and `support` tags. Components supported on the Salesforce platform are listed in the [Component Library](https://developer.salesforce.com/docs/component-library/overview/components).

## What's Not Included

Some base components can run only on the Salesforce platform because they rely on Salesforce data to properly function. These components aren’t included in the package.

-   lightning-input-rich-text
-   lightning-file-upload
-   lightning-record-edit-form
-   lightning-record-view-form
-   lightning-record-form
-   lightning-input-field
-   lightning-output-field
-   lightning-map

## Usage

The npm package content is used by https://webcomponents.dev/org/lwc. This site exposes components in the "What's Included" list. If you're a Salesforce customer, note that only components listed in the [Component Library](https://developer.salesforce.com/docs/component-library/overview/components) are supported in Salesforce orgs, which also include components that are not available in this npm package.

## Documentation

[Lightning Component Reference](https://developer.salesforce.com/docs/component-library/overview/components)

[Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)

[Build Lightning Web Components trail](https://trailhead.salesforce.com/en/content/learn/trails/build-lightning-web-components)

## Contributing

We are not accepting contributions at this time.
