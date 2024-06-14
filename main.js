import { home } from './pages/home.js';
import './style.css';
import { sidebar } from './components/sidebar.js';
import { Bot } from "./classes/bot.js";
import { Message } from "./classes/message.js";

const bot1 = new Bot(
    'Cocktail waiter', 
    './images/cocktail.webp', 
    ['cocktail first letter <letter>', 'ingredient <name>', 'random cocktail'],
    ['Get cocktails by first letter', 'Get data on an ingredient', 'Get a random cocktail'],  
    {
        cocktailByFirstLetter: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=',
        ingredientByName: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?i=',
        randomCocktail: 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
    }
);

const bot2 = new Bot(
    'Chuck Norris', 
    './images/Chuck_norris.webp', 
    ['random chuck joke', 'chuck joke category <category>', 'chuck categories'],
    ['Get a random chuck joke', 'Get a random chuck joke by category', 'Get all the categories'], 
    {
        randomChuckJoke: 'https://api.chucknorris.io/jokes/random',
        chuckJokeByCategory: 'https://api.chucknorris.io/jokes/random?category=',
        chuckCategories: 'https://api.chucknorris.io/jokes/categories'
    }
);

const bot3 = new Bot(
    "Random person", 
    './images/random.webp', 
    ['random user', 'random user params <params>', 'multiple users <count>'],
    ['Get a random user data', 'Get a random user but display only chosen params (gender, name, location, email, login, registered, dob, phone, cell, id, picture, nat)', 'Get multiple random users (up to 10)'], 
    {
        randomUser: 'https://randomuser.me/api/',
        randomUserWithParams: 'https://randomuser.me/api/?inc=',
        multipleUsers: 'https://randomuser.me/api/?results='
    }
);

const bots = [bot1, bot2, bot3];

const render = (component, target) => {
    document.getElementById(target).innerHTML = component();
};

const renderSidebar = (sidebar, target) => {
    document.getElementById(target).innerHTML = sidebar(bots);
};

const appendMessage = (message, chatBox) => {
    const messageElement = message.render();
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(message.toJSON());
    localStorage.setItem('messages', JSON.stringify(messages));
};

const loadMessages = (chatBox) => {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(msg => {
        const loadedMessage = new Message(msg.sender, msg.content);
        appendMessage(loadedMessage, chatBox);
    });
};

const getMessage = input => input.value.trim();

const clearInput = input => {
    input.value = '';
};

const handleSendMessage = async (chatBox, input, bots) => {
    const content = getMessage(input);
    if (content) {
        const userMessage = new Message('User', content);
        appendMessage(userMessage, chatBox);
        clearInput(input);
        const botResponses = await Promise.all(bots.map(bot => bot.respond(userMessage)));
        botResponses.filter(response => response !== null).forEach(response => appendMessage(response, chatBox));
    }
};

const setUpEventListeners = (chatBox, input, sendButton, bots) => {
    sendButton.addEventListener('click', () => handleSendMessage(chatBox, input, bots));
    input.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            handleSendMessage(chatBox, input, bots);
        }
    });
};

const init = () => {
    render(home, 'app');
    renderSidebar(sidebar, 'sidebar-container');

    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    loadMessages(chatBox);

    setUpEventListeners(chatBox, messageInput, sendButton, bots);
};

document.addEventListener('DOMContentLoaded', init);
