const Command = require('../../structure/Command')
const Role = require('../../database/models/Role')

class AllowRole extends Command {

    constructor(client) {
        super(client, {
            name: "allowrole",
            permLevel: 5
        });
    };

    async run(message, args, client) {
        if (args.length == 0) 
            return message.reply("please provide a role name or ID to allow!");

        if (args.length == 1) 
            return message.reply("please provide a target role name or ID to allow!");

        let data = await Role.findOne({$or: [
            {rolename: args[0]},
            {roleid: message.mentions.roles.first() ? message.mentions.roles.first().id : args[0]},
        ]});

        if(!data) return message.reply("that role is not in my system.")

        let target = message.guild.roles.cache.get(args[1]);
        data.allowed.push(target.id);
        data.save();

        client.logger.log(`Role ${data.roleid} allowed to be given by ${target.id} (ran by ${message.author.id})`);
        message.channel.send("Role permissions updated.");
    };

}

module.exports = AllowRole