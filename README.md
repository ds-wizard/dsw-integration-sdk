# DSW Integration SDK

[![npm version](https://badge.fury.io/js/@ds-wizard%2Fintegration-sdk.svg)](https://badge.fury.io/js/@ds-wizard%2Fintegration-sdk)
[![License](https://img.shields.io/github/license/ds-wizard/dsw-integration-sdk)](LICENSE)

This is a JavaScript library for different types of integration with the [Data Stewardship Wizard](https://ds-wizard.org). There are three types of integrations:

- [Action](#action)
- [Importer](#importer)
- [Integration Widget](#integration-widget)


## Instalation

```bash
$ npm install @ds-wizard/integration-sdk
```

We can then import the library:

```javascript
var dsw = require('@ds-wizard/integration-sdk')
```

Or using ES6:

```javascript
import dsw from '@ds-wizard/integration-sdk'
```

Alternatively, we can import the library using the script tag and CDN:

```html
<script src="https://unpkg.com/@ds-wizard/integration-sdk/lib/index.js"></script>
```

`dsw` will then become globally available.



## Usage

This section describes the usage of different components.


### Action

On the page that will serve our action, we need to initialize it first. Then we do whatever we need to perform the action, and finally send the result back to the DSW.

```javascript
const action = new dsw.Action()

action
    .init()
    .then((data) => {
        // Auth token of the user that performed the action
        const userToken = data.userToken

        // UUID of the project on which the action was performed
        const projectUuid = data.projectUuid

        // Do whatever the action should do

        // Send the result back
        // true/false if the action was successful
        // the message can contain Markdown
        action.sendResult(true, 'The action was **successful**!')
    })
    .catch(error => {
        console.error(error)
    })
```

There is [an example](examples/action) in this repository showing a simple action.


### Importer

On the page that will serve our importer, we need to initialize it first. Then we can use call other methods to create the import data. When we have everything ready, we send the replies back to DSW.

```javascript
const importer = new dsw.Importer()
importer.init()
    .then(() => {
        // Question path is a list of UUID strings
        const questionPath = [ /* ... */ ]

        // We can set a reply using the question path and a value
        // The value is either a string for a value question or answer/choice 
        // UUID for options/multichoice question
        importer.setReply(questionPath, 'value')

        // For a list question, we can add an item and then use the item's UUID
        // to build the path for questions in the item
        const itemUuid = importer.addItem(questionPath)
        importer.setReply(
            [...questionPath, itemUuid, itemQuestionUuid],
            'Lee Harris'
        )

        // For an integration question, we can either use setReply to have
        // a plain answer or we can use setIntegrationReply to set the link 
        // as well so that the response will behave as if it was from the 
        // integration
        importer.setIntegrationReply(
            questionPath,
            'Czech Technical University in Prague',
            'https://ror.org/03kqpb082'
        )

        // Send the replies back to DSW
        // this will also close the window
        importer.send()
    })
    .catch(error => {
        console.error(error)
    })
```

There is [an example](examples/importer) in this repository showing a simple action.

#### UUIDs by Annotations

Instead of hardcoding the UUID of a specific entity (chapter, question,...) we can find it using the annotations defined in the knowledge model. For example, if we have a question with the following annotation:

```
Key:   rdfType
Value: http://purl.org/dc/terms/title
```

We can find its UUID using the importer API:

```javascript
const questionUuid = importer.getQuestionUuidByAnnotation('rdfType', 'http://purl.org/dc/terms/title')
```


### Integration Options

For `Action` and `Importer`, we can pass some extra options to the init function. If we don't, the default options will be used.

```javascript
const importer = new dsw.Importer()

importer.init({
    // options go here
})
```

| Option | Value | Default | Description |
| --- | --- | --- |--- |
| `useWizardStyle` | `true`/`false` | `true` | If we want to use the stylesheet from the client that opened the integration (see below). |
| `windowSize` | `{ width: 300, height: 200 }` | `null` | Use this to resize the importer window to the desired size when it is open. |

#### Wizard Styles

DSW Client uses [Bootstrap](https://getbootstrap.com) with customizations, such as changing a primary color. We can load the styles in the integration window to match the look and feel of the client. Then we can use all the Bootstrap classes and variables from the client that opened the importer.

For example, the following CSS code will set the body background color to the primary color of the client that opened the importer:

```css
body {
    background-color: var(--bs-primary);
}
```

This way, we can create reusable importers across different DSW instances while keeping the look and feel of those instances.


### Integration Widget

Integration Widget can be used for advanced integrations in the [Data Stewardship Wizard](https://ds-wizard.org) projects. The DSW opens an external service that serves the widget where users can pick an answer for their project. This type of integration is used where simple search integration is insufficient, e.g., users need to log in first.

On the page that will serve our widget, we need to initialize it first. Then, when the user makes a selection, send it back to the DSW.

```javascript
const widget = new DSWIntegrationWidget('biohack.ds-wizard.org')

widget.init()
    .then(() => {

        // ...

        widget.send(value, id)
    })
    .catch((error) => {
        // handle the error
    })
```

When creating a new widget instance, we need to specify what DSW instance (or instances) the widget should work with. It will not send any data if it is not open from the allowed DSW instance. We can also use an array for more instances:

```javascript
const widget = new DSWIntegrationWidget(['biohack.ds-wizard.org', 'demo.ds-wizard.org'])
```

When sending the data to DSW, the `value` is a text value that will be visible for users in DSW, the `id` is the ID of the item that will be used in the item URL in DSW.

There are examples in this repository. The [simple](examples/integration-widget/simple) example demonstrates a basic widget with the selection. The [login](examples/integration-widget/login) demonstrates how we can redirect users to login first and show the widget.



## Compatibility

| Integration SDK Version | DSW Version from | DSW Version to |
| --- | --- | --- |
| `1.1.0` | `4.10` | `latest` |
| `1.0.0` | `4.1` | `4.9` |



## License

This project is licensed under the Apache License v2.0 - see the
[LICENSE](LICENSE) file for more details.