import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        this.$closeBtn = this.$('close')[0]
    }

    init() {
        // Prevent ESC to close dialog
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    onKeyDown(e) {
        if(e.key === 'Escape') {
            console.log('ESCAPE');
            e.preventDefault()
            this.$closeBtn.click();
        }
    }

    populate(container) {
        this.el.appendChild(container)
    }

    show() {
        this.el.showModal();
        window.addEventListener('keydown', this.onKeyDown);
    }

    close() {
        window.removeEventListener('keydown', this.onKeyDown);
        this.el.close();
    }
}
