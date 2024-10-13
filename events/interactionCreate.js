module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
       if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (command) command.execute(client, interaction);
        }
    }
};