export default class Integration {
    constructor() {
        this._origin = null
    }

    init(options = null) {
        options = options || Integration.defaultOptions
        return new Promise((resolve, reject) => {
            if (!window.opener) {
                reject(new Error('window.opener not set'))
                return
            }

            window.opener.postMessage({ type: 'ready' }, '*')
            window.addEventListener('message', (event) => {
                if (event.data.type === 'ready') {
                    this._origin = event.origin
                    this._initData(event.data.data)

                    if (options.windowSize) {
                        this._resizeWindow(options.windowSize)
                    }

                    if (options.useWizardStyles && event.data.styleUrl) {
                        this._loadWizardStyles(event.data.styleUrl, () => {
                            resolve(event.data.data)
                        })
                    } else {
                        resolve(event.data.data)
                    }
                }
            }, false)
        })
    }

    _initData(data) {

    }

    _resizeWindow({ width, height }) {
        window.resizeTo(Math.min(width, screen.width), Math.min(height, screen.height))
        window.moveTo(screen.width / 2 - width / 2, screen.height / 2  - height / 2)
    }

    _loadWizardStyles(styleUrl, cb) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.onload = cb
        link.setAttribute('href', styleUrl)
        document.getElementsByTagName('head')[0].appendChild(link)
    }

    static get defaultOptions() {
        return {
            useWizardStyles: true,
            windowSize: null
        }
    }
}
