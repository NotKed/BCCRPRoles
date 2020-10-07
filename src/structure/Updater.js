const { exec } = require('child_process')

class Updater {
    
    static run(client) {
        exec('git pull', async(err, stdout, stderr) => {
            let res = await stdout
            if(res !== 'Already up to date.\n') {
                client.logger.log("New update found. Downloading.")
                setTimeout(() => { 
                    exec(client.config.restartCommand);
                 }, 1000*5)
            }
            setTimeout(() => {
                client.logger.log("Checking for update.")
                this.run(client);
            }, 1000*60*60)
        });
    }

}

module.exports = Updater;