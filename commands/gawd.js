const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const cults = [
	{
		name: 'Arcane 🩸',
		powers: [
			'Divine',
			'Chaos',
			'Mystic',
			'Dark',
			'Spirit',
			'Oblivion',
		],
	},
	{
		name: 'Terrene 🌙',
		powers: [
			'Corporeal',
			'Creature',
			'Verdure',
			'Toxic',
			'Mundane',
			'Aqueous',
		],
	},
	{
		name: 'Astral ✨',
		powers: [
			'Cosmos',
			'Inferno',
			'Geological',
			'Automoton',
			'Numerary',
			'Alchemy',
		],
	},
];

function determineCult(dominantPower) {
	const cultMatch = cults.find(cult => cult.powers.includes(dominantPower));
	return cultMatch.name;
}

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
			const { name, external_url, image, dominantPower } = await fetch(`https://www.gawds.xyz/api/gawds/${id}`)
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
				.addFields(
					{ name: 'ID', value : String(id), inline: true },
					{ name: 'Cult', value: determineCult(dominantPower), inline: true },
				)
				.setImage(image);

			await interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			await interaction.editReply(error.message);
		}
	},
};