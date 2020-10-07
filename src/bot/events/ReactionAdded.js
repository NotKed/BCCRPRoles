const Request = require('../../database/models/Request');

class ReactionAdded {

    constructor(client) {
    };

    async run(reaction, user, client) {
        if(reaction.message.channel.id !== '763005064737587200') return;
        if(user.bot) return;

        if(reaction._emoji.name == 'checkMark') {
            reaction.message.reactions.removeAll();
            let data = await Request.findOne({messageid: reaction.message.id});
            let role = reaction.message.guild.roles.cache.get(data.roleid);
            let target = reaction.message.guild.members.cache.get(data.requestedid);
            if(data.type == 'add') {
                target.roles.add(role);
            } else if (data.type == 'remove') {
                target.roles.remove(role);
            }
            let embed = new client.modules.MessageEmbed();
            embed.setColor('00D605');
            embed.setTitle('Role request accepted');
            embed.addField('Requested by', reaction.message.guild.members.cache.get(data.requestedbyid), true);
            embed.addField('Requested for', target, true);
            embed.addField('Role', role, true);
            embed.addField('Status', `Accepted by ${user}`);
            reaction.message.edit(embed);
            reaction.message.guild.members.cache.get(data.requestedbyid).send(`Your role requested was accepted by ${user.tag}`);
            data.delete();
        } else if(reaction._emoji.name == 'xMark') {
            reaction.message.reactions.removeAll();
            let data = await Request.findOne({messageid: reaction.message.id});
            let role = reaction.message.guild.roles.cache.get(data.roleid);
            let target = reaction.message.guild.members.cache.get(data.requestedid);
            let embed = new client.modules.MessageEmbed();
            embed.setColor('D0021B');
            embed.setTitle('Role request denied');
            embed.addField('Requested by', reaction.message.guild.members.cache.get(data.requestedbyid), true);
            embed.addField('Requested for', target, true);
            embed.addField('Role', role, true);
            embed.addField('Status', `Denied by ${user}`);
            reaction.message.edit(embed);
            reaction.message.guild.members.cache.get(data.requestedbyid).send(`Your role requested was denied by ${user.tag}`);
            data.delete();
        }
    }
}

module.exports = ReactionAdded