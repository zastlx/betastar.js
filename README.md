# discontinued
I'm no longer working on this project, see the [version for blacket v2](https://github.com/zastlx/blacket-sdk)

# betastar.js

[![Downloads](https://img.shields.io/npm/dm/betastar.js.svg?style=flat-square)](https://npmjs.org/package/betastar.js)

## About
A very lightweight node.js wrapper for the Blacket chat

The documentation can be found [here](https://github.com/notzastix/betastar.js/blob/main/Documentation.md)

## Installation

```sh-session
npm install betastar.js
```

# Usage

```js
const betastarjs = require('betastar.js');

const client = new betastarjs('zastix', 'NotMyRealPassword');

client.sendMessage("This message is from Node.js!")

client.on('sentMessage', data => {
    console.log(data.message);
});
```
