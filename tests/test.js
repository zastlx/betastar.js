const blacketjs = require('../index.js');
const client = new blacketjs('zastix', 'test');

client.on('connected', (a) => {
    console.log(a);
    client.sendMessage('Connected!')
})

client.on('onMention', async (msg) => {
    //if (msg.author.name != "zastixV2") return;
    console.log(msg.author.elementUrl);
    msg.reply("Your elementUrl is " + msg.author.elementUrl);

    //console.log(msg);
})
client.on('receivedMessage', msg => {
    //client.sendMessage(`The user who mentioned me was: `);
    //console.log(msg)
})
