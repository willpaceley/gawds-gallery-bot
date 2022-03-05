// Require the necessary modules
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
// Set up dotenv for use of process.env
const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Add commands property to client instance
client.commands = new Collection();
// Get all files that end in .js in the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Iterate over each file from the commands directory
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Save command in commands collection, key is command name
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// On interaction creation, execute callback function
client.on('interactionCreate', async interaction => {
	// If the interaction is not a command, exit function
	if (!interaction.isCommand()) return;

	// Get the command from the commands Collection
	const command = client.commands.get(interaction.commandName);

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
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);