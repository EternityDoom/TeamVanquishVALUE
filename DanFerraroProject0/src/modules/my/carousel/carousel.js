import { LightningElement, api } from 'lwc';

const imgs = [
    './resources/croki.jpg',
    './resources/mando.jpg',
    './resources/spidey.jpg',
    './resources/various.jpg',
    './resources/venom.jpg'
];

const SPEED_CLASS_MAP = {
    slow: 'fade-slow',
    fast: 'fade-fast',
    medium: 'fade-medium'
};
const DEFAULT_SPEED = 'medium';

export default class Carousel extends LightningElement {
    animationSpeed = DEFAULT_SPEED;
    index = 0;
    isAnimating = true;
    
    @api
    set speed(value) {
        if (SPEED_CLASS_MAP[value]) {
            this.animationSpeed = value;
        } else {
            this.animationSpeed = DEFAULT_SPEED;
        }
        this.isAnimating = true;
    }

    // Return the internal speed property
    get speed() {
        return this.animationSpeed;
    }

    // Get the current greeting
    get imgs() {
        return imgs[this.index];
    }

    // Map slow, medium, fast to CSS Animations
    get animationClass() {
        if (this.isAnimating) {
            return SPEED_CLASS_MAP[this.speed];
        }
        return 'hide';
    }

    handleAnimationEnd() {
        this.isAnimating = false;
        this.index = (this.index + 1) % imgs.length;

        setTimeout(() => this.updateSlide(), 500);
    }

    // Update to the next greeting and start animating
    updateSlide() {
        this.isAnimating = true;
    }

}
