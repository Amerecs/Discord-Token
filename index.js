const { Client, Collection, MessageAttachment, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = './token.json';

const client = new Client({ intents: 3276799 });

const { clientId, guildId, token, number } = require("./config.js");


client.commands = new Collection()
const commands = []

const commandFiles = fs.readdirSync("commands").filter((file) => file.endsWith(".js"))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
    commands.push(command.data)
}



const eventsFiles = fs.readdirSync("events").filter((file) => file.endsWith(".js"))
for (const file of eventsFiles) {
    const event = require(`./events/${file}`)
    client.on(event.name, async (...args) => {
        event.execute(client, ...args)
    })
}


const rest = new REST().setToken(token)

client.once('ready', async () => {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands })
    console.log('bot is ready');
    client.user.setActivity("Wick Studio", {
type: "STREAMING",
        url: "https://www.twitch.tv/#"
});
});

client.login(token)