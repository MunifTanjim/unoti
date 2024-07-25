[![GitHub Workflow Status: CI](https://img.shields.io/github/actions/workflow/status/MunifTanjim/unoti/ci.yml?label=CI&style=for-the-badge)](https://github.com/MunifTanjim/unoti/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/unoti?style=for-the-badge)](https://npmjs.org/package/unoti)
[![Coverage](https://img.shields.io/codecov/c/gh/MunifTanjim/unoti?style=for-the-badge)](https://codecov.io/gh/MunifTanjim/unoti)
[![License](https://img.shields.io/github/license/MunifTanjim/unoti?style=for-the-badge)](https://github.com/MunifTanjim/unoti/blob/master/LICENSE)

# uNoti

Unified Notification

## Features

- **Flexible Interface**: Can be used for any type of notification channels, e.g.: Email, SMS, Push Notification etc.
- **Supports Template**: Can be used with any template engines, e.g.: [`pug`](https://github.com/pugjs/pug), [`ejs`](https://github.com/tj/ejs), [`mjml`](https://github.com/mjmlio/mjml) etc.
- **Sending Strategy**: Can use custom strategy to send notification using providers.
- **Lightweight**: Gives you flexible system to build upon rather than trying to handle everything itself.

## Installation

```sh
# using pnpm:
pnpm add unoti

# using npm:
npm install --save unoti

# using yarn:
yarn add unoti
```

## Usage

### SMS Notification

```ts
import { NotiChannel, fallbackStrategy } from 'unoti'

type SMSParams = {
  to: string
  text: string
}

type SMSNotiProvider = import('unoti').NotiProvider<SMSParams>

const smsProviderOne: SMSNotiProvider = {
  id: 'sms-provider-one',
  send: async (params) => {
    let id
    // call the SMS provider service using `params` values
    return {
      id,
    }
  },
}

const smsChannel = NotiChannel<SMSParams>({
  id: 'sms',
  providers: [smsProviderOne],
  strategy: fallbackStrategy,
})

smsChannel
  .send({ to: '42', text: 'Hello World!' })
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

### SMS Notification with Template

```ts
import path from 'path'
import pug from 'pug'
import { NotiTemplate, renderRaw } from 'unoti'

type NotiTemplateRenderer = import('unoti').NotiTemplateRenderer

const pugRenderer: NotiTemplateRenderer = async (
  templatePath,
  data,
  options = {},
) => {
  const content = pug.renderFile(templatePath, { ...data, ...options.pug })
  return Promise.resolve(content)
}

const notiTemplate = NotiTemplate({
  path: path.resolve('templates'),
  data: {},
  options: {
    pug: {
      cache: true,
    },
  },
  renderer: {
    pug: pugRenderer,
    txt: renderRaw,
  },
})

type TemplateConfig<T extends string> = {
  topic: T
  data?: Record<string, any>
  options?: Record<string, any>
}

type Topic = 'hi' | 'bye'

type SendSMSOptions = {
  to: SMSParams['to']
  text?: SMSParams['text']
  template?: TemplateConfig<Topic>
}

function sendSms({ to, text = '', template }: SendSMSOptions) {
  const params: SMSParams = {
    to,
    text,
  }

  if (options.template) {
    params.text = await notiTemplate.render(
      { channel: 'sms', topic: template.topic, param: 'text' },
      template.data,
      template.options,
    )
  }

  return smsChannel.send(params)
}

sendSms({
  to: '42',
  template: { topic: 'hi', data: { name: 'John Doe' } },
})
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

**Templates Directory**:

```dir
|--templates
|  |--sms
|  |  |--hi
|  |  |  |--text.pug
   |  |--bye
      |  |--text.txt
```

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE) file for details.
