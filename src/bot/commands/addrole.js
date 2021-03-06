const Command = require('../../structure/Command')
const Role = require('../../database/models/Role')
const Request = require('../../database/models/Request');

class AddRole extends Command {

    constructor(client) {
        super(client, {
            name: "addrole",
            permLevel: 0
        });
    };

    async run(message, args, client) {
        if (args.length == 0) 
            return message.reply("please provide a user to add the role to!");

        if (args.length == 1) 
            return message.reply("please provide a role to add to the user!");

        let data = await Role.findOne({$or: [
            {rolename: new RegExp(`${args.slice(1).join(" ")}`, "i")},
            {roleid: message.mentions.roles.first() ? message.mentions.roles.first().id : args[1]},
        ]});

        if(!data) return message.reply("that role is not in my system.")

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(target.roles.cache.get(data.roleid)) return message.reply("that user already has the role.")

        let allowed = false
        data.allowed.forEach(async (id) => {
            if(message.member.roles.cache.get(id)) allowed = true;
        });

        if(allowed) {
            target.roles.add(message.guild.roles.cache.get(data.roleid));
            message.channel.send("<:checkMark:732633309276012595> Role successfully added.");
            client.logger.log(`${message.author.tag} (${message.author.id}) added role (${data.roleid}) to user ${target.user.tag} (${target.id})`)
        } else {
            // request section
            let embed = new client.modules.MessageEmbed();
            embed.setColor('36393F');
            embed.setTitle('Role request submitted');
            embed.addField('Requested by', message.author, true);
            embed.addField('Requested for', target, true);
            embed.addField('Role', `<@&${data.roleid}>`);
            message.guild.channels.cache.get("763005064737587200").send(embed).then((msg) => {
                msg.react("732633309276012595");
                msg.react("732633283069870170");
                createRequest(msg.id);
            });

            async function createRequest(id) {
                let newReq = new Request();
                newReq.messageid = await id;
                newReq.requestedid = target.id;
                newReq.roleid = data.roleid;
                newReq.requestedbyid = message.author.id;
                newReq.type = 'add';
                newReq.save();
            }

            message.channel.send("<:checkMark:732633309276012595> Role requested submitted.")
        }
    };

}

module.exports = AddRole