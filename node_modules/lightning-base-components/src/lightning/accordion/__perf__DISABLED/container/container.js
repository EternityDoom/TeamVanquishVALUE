import { LightningElement, api } from 'lwc';

export default class PerfAccordionContainer extends LightningElement {
    @api activeSectionName;
    @api sections = [];
    @api allowMultipleSectionsOpen = false;
}
