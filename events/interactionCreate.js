module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		// If the interaction is not a command, exit function
		if (!interaction.isCommand()) return;

		// Get the command from the commands Collection
		const command = interaction.client.commands.get(interaction.commandName);

		// If there is no command stored with that command name, exit function
		if (!command) return;

		// Execute the command
		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};