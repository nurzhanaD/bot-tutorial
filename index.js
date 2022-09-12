const TelegramApi  = require('node-telegram-bot-api');

const { gameOptions, againOptions } = require('./options.js');

const token = '5631414531:AAEW3ysITZsx62meOr7DhoiCFzAc7ydfGQI';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9 а ты должна угадать ее.');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Теперь отгадывай!', gameOptions);
}

const start = () => {

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendMessage(chatId, 'Привет!');
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/99f/faf/99ffafc0-faa8-4948-b401-162cf7317e2a/1.webp ')
        }
        
        if(text === '/myName') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if(text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Прости, я тебя не понял.');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю! Ты угадала цифру ${chats[chatId]}.`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Цифра была ${chats[chatId]}. Сорри!`, againOptions);
        }
    });

}

start();