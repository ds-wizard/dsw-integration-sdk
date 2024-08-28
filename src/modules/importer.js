import Integration from './integration'

export default class Importer extends Integration {
    constructor() {
        super()

        this._events = []
        this._knowledgeModel = null
    }

    _initData(data) {
        this._knowledgeModel = JSON.parse(data.knowledgeModel)
    }

    setReply(path, value) {
        this._events.push({
            type: Array.isArray(value) ? 'ReplyList' : 'ReplyString',
            path: path.join('.'),
            value: value
        })
    }

    setItemSelectReply(path, value) {
        this._events.push({
            type: 'ReplyItemSelect',
            path: path.join('.'),
            value: value
        })
    }

    setIntegrationReply(path, value, id) {
        this._events.push({
            type: 'ReplyIntegration',
            path: path.join('.'),
            value: value,
            id: id
        })
    }

    addItem(path) {
        const uuid = Importer.createUUID()
        this._events.push({
            type: 'AddItem',
            path: path.join('.'),
            uuid: uuid
        })
        return uuid
    }

    send() {
        window.opener.postMessage({
            type: 'import',
            events: this._events
        }, this._origin)
        window.close()
    }

    getAnswerUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.answers, key, value)
    }

    getChapterUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.chapters, key, value)
    }

    getChoiceUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.choices, key, value)
    }

    getExpertUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.experts, key, value)
    }

    getIntegrationUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.integrations, key, value)
    }

    getMetricUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.metrics, key, value)
    }

    getPhaseUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.phase, key, value)
    }

    getQuestionUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.questions, key, value)
    }

    getReferenceUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.reference, key, value)
    }

    getTagUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.tags, key, value)
    }

    _getEntityUuidByAnnotation(entities, key, value) {
        for (const [uuid, question] of Object.entries(entities)) {
            if (question.annotations.some((annotation) => annotation.key === key && annotation.value == value)) {
                return uuid
            }
        }
        return null
    }

    getFirstChapterUuid() {
        if (this._knowledgeModel.chapterUuids.length === 0) return null
        return this._knowledgeModel.chapterUuids[0]
    }

    static createUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}
