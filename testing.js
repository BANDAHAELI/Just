📂 *File Content of sarkarx13.js*:

import config from '../../config.cjs';

const antilink2Command = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  // Enable/Disable Antilink2 feature
  if (cmd === 'antilink2') {
    if (m.sender !== ownerNumber) {
      return m.reply('*Only the owner can use this command.*');
    }

    if (text === 'on') {
      config.ANTILINK2 = true;
      await Matrix.sendMessage(m.from, { text: 'Antilink2 feature has been enabled.' }, { quoted: m });
    } else if (text === 'off') {
      config.ANTILINK2 = false;
      await Matrix.sendMessage(m.from, { text: 'Antilink2 feature has been disabled.' }, { quoted: m });
    } else {
      await Matrix.sendMessage(
        m.from,
        {
          text: 'Usage:\n- `antilink2 on`: Enable Antilink2\n- `antilink2 off`: Disable Antilink2',
        },
        { quoted: m }
      );
    }
  }

  // Antilink functionality for groups
  if (config.ANTILINK2 && m.isGroup) {
    const linkRegex = /https?:\/\/[^\s]+/; // Match all links starting with http/https
    if (linkRegex.test(m.body)) {
      const groupMetadata = await Matrix.groupMetadata(m.from);
      const senderIsOwner = m.sender === ownerNumber;
      const senderIsAdmin = groupMetadata.participants
        .filter((participant) => participant.id === m.sender)
        .map((participant) => participant.admin)
        .includes('admin');

      if (!senderIsOwner && !senderIsAdmin) {
        // Delete the message
        await Matrix.sendMessage(m.from, { delete: m.key });

        // Warn the user
        await Matrix.sendMessage(
          m.from,
          {
            text: `*⚠️ Warning:*\n@${m.sender.split('@')[0]} *Don't send links here.*`,
            mentions: [m.sender],
          },
          { quoted: m }
        );
      }
    }
  }
};

export default antilink2Command;
