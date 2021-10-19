import { LightningElement, api } from 'lwc';

export default class ExpandingCard extends LightningElement {
    imageFilePath;
    paragraphText = "Lorem ipsum";

    @api
    set imageSource(value) {
        this.imageFilePath = value;
    }

    get imageSource(){ return this.imageFilePath; }

    @api
    set detailText(value) {
        this.paragraphText = value;
    }

    get detailText() { return this.paragraphText; }
}