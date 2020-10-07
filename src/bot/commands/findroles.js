const Command = require('../../structure/Command')
const Role = require('../../database/models/Role')

class FindRoles extends Command {

    constructor(client) {
        super(client, {
            name: "findroles",
            permLevel: 0
        });
    };

    async run(message, args, client) {
        if (args.length == 0) 
            return message.reply("please provide a role name or ID to find!");

        let roles = [];
        let data = await Role.find().lean();
        for(let role in data) {
            if(data[role].rolename.toLowerCase().includes(args[0]) || data[role].roleid == args[0]) {
                roles.push(data[role])
            }
        }

        let embed = new client.modules.MessageEmbed();
        let description = "The list down below contains the roles that contain the name that you provided. The number between the brackets is the ID of the role.\n\n**Roles**";
        embed.setTitle(`Search results for "${args[0]}"`);
        for(let role in roles) {
            description += `\n${parseInt(role)+1}. <@&${roles[role].roleid}> (${roles[role].roleid})`;
        }
        embed.setDescription(description);
        embed.setColor('36393F');
        return message.channel.send(embed);
    };

}

module.exports = FindRoles