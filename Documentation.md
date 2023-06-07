# betastar

Documentation for the node.js blacket.js library<br>
You can find examples of this library at [this repo](https://github.com/notzastix/betastar.js-examples)

### Usage
```js
const betastarjs = require('betastar.js');

const client = new betastarjs('zastix', 'NotMyRealPassword');

client.sendMessage("This message is from Node.js!")

client.on('sentMessage', data => {
    console.log(data.message);
});
```

## Functions
### - **`sendMessage(message)`** - Sends a message in betastar chat.

#### Parameters:
| name | description |
|-|-|
|*message*|The message to send - **String*|

Example:
```js
const betastarjs = require('betastar.js');
const client = new betastarjs('zastix', 'NotMyRealPassword');

client.sendMessage("A message from Node.js!");
```

## Events
### `sentMessage` - [sendMessage()](https://github.com/notzastix/betastar.js/blob/main/Documentation.md#--sendmessagemessage---sends-a-message-in-betastar-chat)

- Emitted when a message is sent
    - Returns a [message Object](https://github.com/notzastix/betastar.js/blob/main/Documentation.md#attributes-1)


### `receivedMessage` - socketMessage

- Emitted when a message is recieved via `rmes`
    - Returns a [message Object](https://github.com/notzastix/betastar.js/blob/main/Documentation.md#message)

### `connected` - socketMessage

- Emitted when the client is connected to the betastar chat
    - returns a [clientInfo Object](https://github.com/notzastix/betastar.js/blob/main/Documentation.md#message)

### `onMention` - socketMessage

- Emitted when a message recieved via `rmes` includes a mention to the current user
    - Returns a [message Object](https://github.com/notzastix/betastar.js/blob/main/Documentation.md#clientInfo)

 ## Objects / Classes
 
 ### **`user`**
 #### Attributes
  - name - String, the name of the user
  - role - String, the users role / rank
  - element - String, the name of the user's element
  - elementUrl - String, the link to the users element
  - color - String, the users color to their role / username
  - atoms - String, the users amount of atoms
  - linked - Object, the users linked discord account (e.g. "{ name: "zastix#0001", image: "/image/user/2cc55bfd0bed5d7637cfd6a6620217ef.png" }" )
    
 #### Methods
  - None.
<br>
 
 ### **`message`**
 #### Attributes
  - raw - Object, the raw data from the socket message
  - content - String, content of the message.
  - author - the [user]() who sent the message
  - everyoneMentioned - Boolean, true if @everyone or @here was mentioned.
  - mentioned - String / null, if its being accesed with the [onMention](https://github.com/notzastix/betastar.js/blob/main/Documentation.md#onmention---socketmessage) object it will be the author of the message who mentioned the bot.

 #### Methods
  - reply(msg) - Sends a reply to the message.
<br>

### **`clientInfo`**
 #### Attributes
  - user - Object, includes the logged in accounts username (e.g. { username: 'zastix', password: 'password' })
  - PHPSESSID - String, the phpsessid of the logged in account, (it is reccomened to keep using client.token for API requests)

 #### Methods
  - None.
<br>