const {exec} = require('child_process')

exec('git pull', async (err, stdout, stderr) => {
    let data = await stdout;
    if(data == "Already up to date.") {
        console.log("ready");
    } else {
        console.log(data)
        console.log(data == "Already up to date.\n")
        setTimeout(() => {
            console.log(data)
            console.log(data == "Already up to date.")
            console.log("updated.")
        }, 1000*10)
    }
})