const Command = require('../../structure/Command')
const Role = require('../../database/models/Role')

class CreateRole extends Command {

    constructor(client) {
        super(client, {
            name: "createrole",
            permLevel: 5
        });
    };

    async run(message, args, client) {
        if (args.length == 0) 
            return message.reply("please provide a role name or ID to create!");

        let target = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.cache.get(args[0]);
        console.log(target.id)

        let newRole = new Role();
        newRole.rolename = target.name;
        newRole.roleid = target.id;
        newRole.allowed = [];
        newRole.save();

        client.logger.log(`Role ${newRole.rolename} (${newRole.roleid}) created by ${message.author.id}`);
        message.channel.send("Role created. Use $allowrole to setup permissions.");
    };

}

module.exports = CreateRole