const Client = require('./src/structure/Client');
const version = '1.0.0';
const config = require('./config.json');
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const client = new Client();

exec("git pull", (error, stdout, stderr) => {
    client.logger.log("Checking for update.")
    if(stdout == "Already up to date.\n") {
        client.logger.log("No new update available.")
    } else {
        client.logger.log("Downloading new update.")
        setTimeout(() => {
            exec(config.restartCommand);
        }, 1000*10);
    }
});

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
};

mongoose.connect('mongodb://localhost:27017/directoire', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (() => client.logger.log("Connected to mongodb://localhost:27017/directoire")));

client.on("ready", async () => {
    client.functions.onReady();
})

