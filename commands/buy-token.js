const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = './token.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy-token')
    .setDescription('Get a specified number of bot tokens and invite links'),
  async execute(client, interaction) {
    if (!fs.existsSync(path)) {
      return interaction.reply({ content: 'لا توجد توكنات متاحة.', ephemeral: true });
    }

    let tokens;
    try {
      tokens = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (error) {
      return interaction.reply({ content: 'تعذر قراءة بيانات التوكنات.', ephemeral: true });
    }

    const botIds = Object.keys(tokens);

    if (botIds.length === 0) {
      return interaction.reply({ content: 'لا توجد توكنات متاحة.', ephemeral: true });
    }

    const randomBotId = botIds[Math.floor(Math.random() * botIds.length)];
    const token = tokens[randomBotId];

    // إرسال التوكن والرابط إلى المستخدم
    const embed = new MessageEmbed()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setDescription(`Here is your token: \`${token}\`\nInvite link: [Invite Bot](https://discord.com/oauth2/authorize?client_id=${randomBotId}&scope=bot&permissions=8)`)
      .setColor('RANDOM')
      .setTimestamp();

    try {
      await interaction.reply({ embeds: [embed] });

      // حذف التوكن بعد إرساله
      delete tokens[randomBotId];
      fs.writeFileSync(path, JSON.stringify(tokens, null, 2));
    } catch (error) {
      console.error('Error sending token or deleting token:', error);
      return interaction.reply({ content: 'حدث خطأ أثناء معالجة طلبك.', ephemeral: true });
    }
  },
};
