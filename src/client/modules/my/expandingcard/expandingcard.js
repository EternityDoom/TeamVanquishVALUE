import { LightningElement, api } from 'lwc';

export default class ExpandingCard extends LightningElement {
    imageFilePath;
    paragraphText = "Lorem ipsum";
    expanded = false;

    @api
    set imagesource(value) {
        this.imageFilePath = value;
    }

    get imagesource(){ return this.imageFilePath; }

    @api
    set detailtext(value) {
        this.paragraphText = value;
    }

    get detailtext() { return this.paragraphText; }

    handleClick() {
        this.expanded = !this.expanded;
    }
}