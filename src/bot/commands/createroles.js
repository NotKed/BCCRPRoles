const Command = require('../../structure/Command')
const Role = require('../../database/models/Role')

class CreateRoles extends Command {

    constructor(client) {
        super(client, {
            name: "createroles",
            permLevel: 5
        });
    };

    async run(message, args, client) {
        message.guild.roles.cache.forEach(r => {
            let newRole = new Role();
            newRole.rolename = r.name;
            newRole.roleid = r.id;
            newRole.allowed = [];
            newRole.save();
            console.log(r.name);
        });
        message.channel.send("Role created. Use $allowrole to setup permissions.");
    };

}

module.exports = CreateRoles