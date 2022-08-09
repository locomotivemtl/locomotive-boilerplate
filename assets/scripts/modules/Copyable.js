import { module } from 'modujs'

export default class extends module {
    constructor(m) {
        super(m)

        // UI
        this.$el = this.el
        this.$tooltip = this.$('tooltip')[0]

        this.events = {
            click: {
                item: 'onItemClick'
            }
        }
    }

    onItemClick(e) {
        const $element = e.currentTarget

        if (this.getData('content', $element)) {
            navigator.clipboard.writeText(this.getData('content', $element))
        } else {
            this.copyFormattedHTML($element)
        }

        this.showTooltip()
    }

    showTooltip() {
        clearTimeout(this.timeoutTooltip)

        this.$tooltip.classList.add('is-visible')

        this.timeoutTooltip = setTimeout(() => {
            this.hideTooltip()
        }, 1500)
    }

    hideTooltip() {
        clearTimeout(this.timeoutTooltip)

        this.$tooltip.classList.remove('is-visible')
    }

    copyFormattedHTML($element) {
        let content = $element.innerHTML

        // Create array using line breaks as separators
        let lines = content.split(/(\r\n|\n|\r)/gm)
        for (var i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/(\r\n|\n|\r)/gm, "")
        }

        // Store empty lines indexes
        let emptyLines = []
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim().length == 0 ) {
                emptyLines.push(i)
            }
        }

        // Remove empty lines
        for (var i = emptyLines.length - 1; i >= 0; i--) {
            lines.splice(emptyLines[i], 1)
        }

        // Get indentation spaces count
        const spacesBefore = lines[0].split('<')[0].length

        // Remove indentation spaces for each line
        for (var i = 0; i < lines.length; i++) {
            lines[i] = lines[i].slice(spacesBefore)
        }

        // Join array
        const formattedHTML = lines.join('\n')

        // Copy to clipboard
        navigator.clipboard.writeText(formattedHTML)
    }
}
