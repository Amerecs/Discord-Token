const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const path = './token.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-token")
        .setDescription("Add the token and bot ID")
        .addStringOption(option => 
            option.setName("token")
                .setDescription("Paste the token here")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("botid")
                .setDescription("Paste the bot ID here")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        // Check if the user has the required permissions
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        // Get the token and botId from the options
        const token = interaction.options.getString("token");
        const botId = interaction.options.getString("botid");

        try {
            // Read existing tokens from file or initialize an empty object
            let tokens = {};
            if (fs.existsSync(path)) {
                tokens = JSON.parse(fs.readFileSync(path, 'utf-8'));
            }

            // Add or update the token for the given botId
            tokens[botId] = token;
            fs.writeFileSync(path, JSON.stringify(tokens, null, 2), 'utf-8');

            // Create and send the response embed
            const embed = new MessageEmbed()
                .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
                .setDescription("Token added successfully.")
                .setColor("RANDOM")
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error processing /add-token command:', error);
            await interaction.reply({ content: "An error occurred while processing the command. Please try again later.", ephemeral: true });
        }
    }
};
