class Header extends HTMLElement {
    constructor() {
        super();
        console.log('Header constructor');
    }
    connectedCallback() {
        console.log('Header connected');
    }
}

customElements.define('c-header', Header);