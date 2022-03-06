const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gawd')
		.setDescription('Displays a Gawd by ID')
		// An option is an input from the user, e.g. to get the ID
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('The ID for the Gawd to display')
				.setRequired(true)),
	// The function that will be executed on calling the command
	async execute(interaction) {
		const id = interaction.options.getInteger('id');
		// Immediately deferReply() so interaction token doesn't expire during fetch
		await interaction.deferReply();

		try {
			// Fetch the data we need for the embed
			const { name, external_url, image } = await fetch(`https://www.gawds.xyz/api/gawds/${id}`)
				.then(response => {
					// Check if the API returns a Gawd for the ID specified
					if (!response.ok) {
						throw new Error(`No Gawd found with ID ${id}`);
					}
					return response.json();
				});

			// Create embed for message reply
			const embed = new MessageEmbed()
				.setColor('#D0034C')
				.setTitle(name)
				.setURL(external_url)
				.setImage(image);

			await interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			await interaction.editReply(error.message);
		}
	},
};