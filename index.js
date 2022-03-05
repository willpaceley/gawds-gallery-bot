// Require the necessary modules
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
// Set up dotenv for use of process.env
const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

/* --- COMMAND HANDLING --- */

// Add commands property to client instance
client.commands = new Collection();
// Get all files that end in .js in the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Iterate over each js file from the commands directory
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Save command in commands collection, key is command name
	client.commands.set(command.data.name, command);
}

/* --- EVENT HANDLING --- */

// Get all files in the events directory that end in .js
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Iterate over each js file from events directory
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);