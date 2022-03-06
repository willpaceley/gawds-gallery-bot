const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gawd')
		.setDescription('Displays a Gawd by ID')
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('The ID for the Gawd to display')
				.setRequired(true)),
	async execute(interaction) {
		const id = interaction.options.getInteger('id');
		await interaction.reply(`Displaying Gawd #${id}`);
	},
};