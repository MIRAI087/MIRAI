module.exports = async (message) => { if 
  (!message.guild) return; if 
  (message.author.bot) return;
  // Lewati Admin
  if 
  (message.member.permissions.has("Administrator")) 
  return;
  // Deteksi link
  const regex = 
  /(https?:\/\/|www\.|discord\.gg\/|discord\.com\/invite\/)/i; 
  if (!regex.test(message.content)) 
  return; await 
  message.delete().catch(() => {}); 
  await message.channel.send({
    content: `⚠️ ${message.author}, link 
    tidak diperbolehkan di server ini.`,
  }).then(msg => {
    setTimeout(() => 
    msg.delete().catch(() => {}), 5000);
  });
};
