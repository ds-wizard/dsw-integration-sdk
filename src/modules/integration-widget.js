export default class IntegrationWidget {

    constructor(allowedHosts) {
        if (!Array.isArray(allowedHosts)) {
            allowedHosts = [allowedHosts]
        }

        this._allowedHosts = allowedHosts
        this._path = null
        this._origin = null
    }

    init() {
        return new Promise((resolve, reject) => {
            if (!window.opener) {
                reject(new Error('window.opener not set'))
                return
            }

            window.opener.postMessage({ type: 'ready' }, '*')
            window.addEventListener('message', (event) => {
                if (!this._isEventOriginAllowed(event)) {
                    return
                }

                if (event.data.type === 'ready') {
                    this._path = event.data.data.path
                    this._origin = event.origin
                    resolve()
                }
            }, false)
        })
    }

    send(value, id) {
        window.opener.postMessage({
            type: 'selection',
            id,
            value,
            path: this._path
        }, this._origin)
    }

    _isEventOriginAllowed(event) {
        return this._allowedHosts.includes(this._getEventOrigin(event))
    }

    _getEventOrigin(event) {
        const parts = event.origin.split('://')
        return parts.length > 1 ? parts[1].split(':')[0] : null
    }
}