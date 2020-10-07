const Client = require('./src/structure/Client');
const version = '1.0.0';
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');
const client = new Client();

client.functions = {};
client.functions.onReady = function() {
    console.log("-------------------------------------------------------------------------------------------------");
    console.log(chalk.green(figlet.textSync('BCCRP', { horizontalLayout: 'full' })));
    console.log("-------------------------------------------------------------------------------------------------");
    console.log(chalk.white('-'), chalk.red("Version:"), chalk.white(version));
    console.log(chalk.white('-'), chalk.red("Discord Token:"), chalk.white(client.config.discordToken));
    console.log(chalk.white('-'), chalk.red("Bot Prefix:"), chalk.white(client.config.discordPrefix));
    console.log("-------------------------------------------------------------------------------------------------");
    client.logger.log(`Success: BCCRP Roles started.`)
    client.updater.run(client);
};

mongoose.connect('mongodb://localhost:27017/directoire', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (() => client.logger.log("Connected to mongodb://localhost:27017/directoire")));

client.on("ready", async () => {
    client.functions.onReady();
})

