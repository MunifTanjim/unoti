# uNoti

Unified Notification

## Installation

```sh
# using yarn:
yarn add unoti

# using npm:
npm install --save unoti
```

## Usage

```js
const { NotiChannel, fallbackStrategy } = require('unoti')

const smsProviderOne = {
  id: 'sms-provider-one',
  send: async params => {
    let id
    // Call the SMS provider service using `params` values
    return {
      id
    }
  }
}

const smsChannel = NotiChannel({
  id: 'sms',
  providers: [smsProviderOne],
  strategy: fallbackStrategy
})

smsChannel
  .send(params)
  .then(response => console.log(response))
  .catch(err => console.error(err))
```

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE) file for details.
