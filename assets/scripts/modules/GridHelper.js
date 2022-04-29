import { module } from 'modujs';

export default class GridHelper extends module {

    static get settings() {
        return {
            GUTTER: 'var(--grid-gutter, 0)',
            MARGIN: 'var(--grid-margin, 0)',
            COLOR: 'rgba(255, 0, 0, .1)',
        }
    }

    constructor(m) {
        super(m);
    }

    init() {
        this.setColumns()
        this.setStyles()
        this.bindEvents()

        window.addEventListener('resize', this.onResize = () => this.setColumns())
    }

    setColumns() {

        // Clear columns
        this.el.innerHTML = ''

        // Loop through columns
        const columns = Number(window.getComputedStyle(this.el).getPropertyValue('--grid-columns'))

        let $col
        for (var i = 0; i < columns; i++) {
            $col = document.createElement('div')
            $col.style.flex = '1 1 0'
            $col.style.backgroundColor = GridHelper.settings.COLOR
            this.el.appendChild($col)
        }
    }

    setStyles() {
        const elStyles = this.el.style
        elStyles.zIndex = '10000'
        elStyles.position = 'fixed'
        elStyles.top = '0'
        elStyles.left = '0'
        elStyles.display = 'flex'
        elStyles.width = '100%'
        elStyles.height = '100%'
        elStyles.columnGap = GridHelper.settings.GUTTER
        elStyles.paddingLeft = `calc(${GridHelper.settings.MARGIN} + ${GridHelper.settings.GUTTER})`
        elStyles.paddingRight = `calc(${GridHelper.settings.MARGIN} + ${GridHelper.settings.GUTTER})`
        elStyles.pointerEvents = 'none'
        elStyles.visibility = 'hidden'
    }

    bindEvents() {

        let ctrlDown = false
        let isActive = false
        document.addEventListener('keydown', (e) => {
            if(e.key == 'Control') {
                ctrlDown = true;
            } else {
                if(ctrlDown && e.key == 'g') {

                    if(isActive) {
                        this.el.style.visibility = 'visible'
                    } else {
                        this.el.style.visibility = 'hidden'
                    }

                    isActive = !isActive
                }
            }
        })

        document.addEventListener('keyup', (e) => {
            if(e.key == 'Control') {
                ctrlDown = false
            }
        })
    }

    destroy() {
        window.removeEventListener('resize', this.onResize)
    }
}
