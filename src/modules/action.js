import Integration from './integration'

export default class Action extends Integration {
    sendResult(success, message) {
        window.opener.postMessage({
            type: 'actionResult',
            success,
            message
        }, this._origin)
        window.close()
    }
}
