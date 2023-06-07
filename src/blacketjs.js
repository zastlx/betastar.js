const axios = require("axios");
const EventEmitter = require("events");
const sio = require("socket.io-client");
const btoa = require("btoa");
const atob = require('atob');
const wsMessages = require('./assets/wsMessages');
const elementList = require('./assets/elementList');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class betastarjs extends EventEmitter {



    
    #ratelimited;
    #delay = 3000;

    socket;
    info;

    token;




    
    #socketWorking;
    #lastMessage;

    constructor(username, password) {
        super();
        this.info = {
            username: username,
            password: btoa(password),
        };
        axios.post("https://betastar.org/api/login/", `username=${this.info.username}&password=${this.info.password}`, {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            this.token = res.headers["set-cookie"][0].split(";")[0];
            this.socket = sio.connect("https://betastar.org/", {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Cookie: this.token,
                        },
                    },
                },
            });
            const timeout = setTimeout(() => {
                this.socket.disconnect();
            }, 10 * 1000);

            this.socket.on("connect", () => {
                this.emit('connected', {
                    user: {
                        username: this.info.username,
                        password: atob(this.info.password)
                    },
                    PHPSESSID: this.token
                });
                clearTimeout(timeout);
                this.#socketWorking = true;
            });

            this.socket.on(wsMessages.chat.receive, (json) => {
                axios.get("https://betastar.org/api/user/?name=" + json.user, {
                    headers: {
                        Cookie: this.token,
                    },
                }).then((data) => {
                    var aData = data.data;
                    try {
                        var obj = {
                            raw: json,
                            content: json.message,
                            mentioned: json.message.split(" ").filter((x) => x.startsWith("@")).map((x) => x.slice(1)),
                            author: {
                                name: json.user,
                                role: json.role,
                                element: json.element === null ?
                                    "blax" : json.element.startsWith("CUSTOM|") ?
                                    json.element.replace("CUSTOM|", "") : json.element,
                                elementUrl: json.element === null ?
                                `https://betastar.org${elementList.blax.imageURL}` : !json.element.startsWith("CUSTOM|") ?
                                    `https://betastar.org${elementList[json.element].imageURL}` : null,
                                color: json.color,
                                atoms: aData.atoms,
                                linked: aData.linked !== "none" ? {
                                    name: aData.linked.split("|")[0],
                                    image: aData.linked.split("|")[1],
                                } : {
                                    tag: undefined,
                                    image: undefined
                                }
                            },
                            reply: (msg) => {
                                this.sendMessage(`@${json.user}, ${msg}`);
                            },
                            mentions: json.message.split(" ").filter((x) => x.startsWith("@")).map((x) => x.slice(1)), // todo
                            everyoneMentioned: false,
                        };
                    } catch (e) {
                        var obj = {
                            raw: json,
                            content: json.message,
                            mentioned: json.message.split(" ").filter((x) => x.startsWith("@")).map((x) => x.slice(1)),
                            author: {
                                name: json.user,
                                role: json.role,
                                element: json.element === null ?
                                    "blax" : json.element.startsWith("CUSTOM|") ?
                                    json.element.replace("CUSTOM|", "") : json.element,
                                color: json.color,
                                atoms: aData.atoms,
                                linked: ((aData.linked === "none") || (aData.linked === undefined) || (aData.linked === "") || (aData.linked === null)) ? {
                                    tag: "None#0000",
                                    image: "https://images.binaryfortress.com/General/UnknownUser1024.png",
                                } : {
                                    name: aData.linked.split("|")[0],
                                    image: aData.linked.split("|")[1],
                                },
                            },
                            reply: (msg) => {
                                this.sendMessage(`@${json.user}, ${msg}`);
                            },
                            mentions: json.message.split(" ").filter((x) => x.startsWith("@")).map((x) => x.slice(1)), // todo
                            everyoneMentioned: false,
                        };
                    }

                    if (
                        json.message.includes("@everyone") ||
                        json.message.includes("@here") /*|| true */
                    )
                        obj.everyoneMentioned = true;

                    this.emit("receivedMessage", obj);
                    if (json.message.includes(`@${this.info.username} `) || json.message.endsWith(`@${this.info.username}`)) {
                        obj.mentioned = json.user;
                        //console.log(obj.mentioned);
                        this.emit("onMention", obj);
                    }
                });
            });
        });

        return this;
    }

    async sendMessage(msg) {
        if (!this.#ratelimited) {
            if (msg == this.#lastMessage) {
                msg = msg + ' ';
            }
            this.#lastMessage = msg;

            if (!this.#socketWorking) await sleep(500);

            this.socket.emit(wsMessages.chat.send, msg);
            this.emit("sentMessage", {
                message: msg,
            });
            this.#ratelimited = true;
            setTimeout(() => {
                this.#ratelimited = false;
            }, this.#delay);
        }
    }
}

module.exports = betastarjs;
