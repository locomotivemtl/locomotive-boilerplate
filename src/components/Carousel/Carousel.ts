class Carousel extends HTMLElement {
    constructor() {
        super();
        console.log('Carousel constructor');
    }
    connectedCallback() {
        console.log('Carousel connected');
    }
}
console.log('Carousel loaded');
customElements.define('c-carousel', Carousel);