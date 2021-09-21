const config = require('./config.json');

const print_invite = function() {
    // print the invite link for this bot
    return `https://discord.com/oauth2/authorize?client_id=\
${config['ID']}&permissions=${config['permissions']}&scope=bot+applications.commands`;
};

console.log('Invite link \n', print_invite());
