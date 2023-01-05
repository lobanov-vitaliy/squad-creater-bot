const TelegramBot = require('node-telegram-bot-api');
const token = '5933177184:AAHSsi4LYhFEK6x8pm6Avcgld-i9MN43MjM';
const bot = new TelegramBot(token, {polling: true});
const teams = new Map()
const membersCount = 5

bot.onText(/\/create/, (msg, match) => {
  const chatId = msg.chat.id;

  teams.set(chatId, {
    needs: membersCount,
    players: [msg.from],
  })

  bot.sendMessage(chatId, `Слава Україні!! Відкрився набір в команду, потрібно ${membersCount} гравців, для приєднання відправте команду /join`);
  bot.sendMessage(chatId, `1/${membersCount} @${msg.from.username} готовий`);
});

bot.onText(/\/squad/, (msg, match) => {
  const chatId = msg.chat.id;
  const team = teams.get(chatId)

  if (team) {
    bot.sendMessage(chatId, `Cклад команди: ${team.players.map(player => `@${player.username}`).join(' ')}, для приєднання відправте команду /join`);
  } else {
    bot.sendMessage(chatId, 'Немає відкритого набору до команди, для створення команди напишіть /create');
  }
});

bot.onText(/\/remove/, (msg, match) => {
  const chatId = msg.chat.id;
  const team = teams.get(chatId)

  if (team) {
    if (team.players.some(player => player.id === msg.from.id)) {
      team.players = team.players.filter(player => player.id !== msg.from.id)
      bot.sendMessage(chatId, `@${msg.from.username} більше не наш побратим на цю катку`);
    } else {
      bot.sendMessage(chatId, `@${msg.from.username} не зли мене, ти ще навіть не в команді виродок!!`);
    }
  } else {
    bot.sendMessage(chatId, 'Немає відкритого набору до команди, для створення команди напишіть /create');
  }
});

bot.onText(/\/join/, (msg, match) => {
  const chatId = msg.chat.id;
  const team = teams.get(chatId)
  if (!msg.from.is_bot) {
    if (team) {
      if (team.players.some(player => player.id === msg.from.id)) {
        bot.sendMessage(chatId, `@${msg.from.username} не зли мене, ти і так вже в команді виродок!! Відправь /squad щоб подивитися склад`);
      } else {
        team.players.push(msg.from)
        bot.sendMessage(chatId, `${team.players.length}/${team.needs} @${msg.from.username} готовый`);
      }
    } else {
      bot.sendMessage(chatId, 'Немає відкритого набору до команди, для створення команди напишіть /create');
    }

    if (team.players.length === team.needs) {
      bot.sendMessage(chatId, `Героям Слава!!! Формування загону зі знищення свинособак готовий, склад команди: ${team.players.map(player => `@${player.username}`).join(' ')}`);
    }
  }
});
