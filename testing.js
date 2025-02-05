import config from '../../config.cjs';

const pmblockCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const ownerNumbers = ['923253617422@s.whatsapp.net', '923143200187@s.whatsapp.net'];
  const sudoNumbers = config.SUDOS.map((number) => `${number}@s.whatsapp.net`);
  const allowedNumbers = new Set([...ownerNumbers, ...sudoNumbers]);
  const sender = m.sender;

  // Track warnings for each sender
  if (!global.warningCounts) {
    global.warningCounts = {};
  }

  if (!allowedNumbers.has(sender)) {
    if (!global.warningCounts[sender]) {
      global.warningCounts[sender] = 0;
    }
    global.warningCounts[sender]++;

    if (global.warningCounts[sender] < 4) {
      await Matrix.sendMessage(
        m.from,
        {
          text: `*⚠️ Warning ${global.warningCounts[sender]}:*
@${sender.split('@')[0]} *Do not message this bot in private. Continuing will result in a block.*`,
          mentions: [sender],
        },
        { quoted: m }
      );
    } else {
      // Final block message and action
      await Matrix.sendMessage(
        m.from,
        { text: '*🚫 You have been blocked for repeatedly messaging this bot in private.*' },
        { quoted: m }
      );

      // Block the user
      await Matrix.updateBlockStatus(sender, 'block');
    }
  }
};

export default pmblockCommand;
