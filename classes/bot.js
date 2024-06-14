import { Message } from './message.js';

export class Bot {
    constructor(name, image, commands, commandData, apiConfig) {
        this.name = name;
        this.image = image;
        this.commands = commands;
        this.commandData = commandData;
        this.apiConfig = apiConfig;
    }

    async respond(userMessage) {
        const command = this.parseCommand(userMessage.content);
        let responseContent = '';

        try {
            switch (command.type) {
                case 'cocktailByFirstLetter':
                    responseContent = await this.getCocktailsByFirstLetter(command.param);
                    break;
                case 'ingredientByName':
                    responseContent = await this.getIngredientByName(command.param);
                    break;
                case 'randomCocktail':
                    responseContent = await this.getRandomCocktail();
                    break;
                case 'randomChuckJoke':
                    responseContent = await this.getRandomChuckJoke();
                    break;
                case 'chuckJokeByCategory':
                    responseContent = await this.getChuckJokeByCategory(command.param);
                    break;
                case 'chuckCategories':
                    responseContent = await this.getChuckCategories();
                    break;
                case 'randomUser':
                    responseContent = await this.getRandomUser();
                    break;
                case 'randomUserWithParams':
                    responseContent = await this.getRandomUserWithParams(command.param);
                    break;
                case 'multipleUsers':
                    responseContent = await this.getMultipleUsers(command.param);
                    break;
                case 'help':
                    responseContent = this.getCommands();
                    break;
                case 'all':
                    responseContent = await this.getAll();
                    break;
            }
        } catch (error) {
            responseContent = '';
        }

        return responseContent ? new Message(this, responseContent) : null;
    }

    parseCommand(content) {
        const lowerContent = content.toLowerCase();
        if (lowerContent.startsWith('cocktail first letter ')) {
            const letter = lowerContent.split('cocktail first letter ')[1];
            return { type: 'cocktailByFirstLetter', param: letter };
        } else if (lowerContent.startsWith('ingredient ')) {
            const ingredient = lowerContent.split('ingredient ')[1];
            return { type: 'ingredientByName', param: ingredient };
        } else if (lowerContent === 'random cocktail') {
            return { type: 'randomCocktail' };
        } else if (lowerContent === 'random chuck joke') {
            return { type: 'randomChuckJoke' };
        } else if (lowerContent.startsWith('chuck joke category ')) {
            const category = lowerContent.split('chuck joke category ')[1];
            return { type: 'chuckJokeByCategory', param: category };
        } else if (lowerContent === 'chuck categories') {
            return { type: 'chuckCategories' };
        } else if (lowerContent === 'random user') {
            return { type: 'randomUser' };
        } else if (lowerContent.startsWith('random user params ')) {
            const params = lowerContent.split('random user params ')[1];
            return { type: 'randomUserWithParams', param: params };
        } else if (lowerContent.startsWith('multiple users ')) {
            const count = lowerContent.split('multiple users ')[1];
            return { type: 'multipleUsers', param: count };
        } else if (lowerContent === 'help') {
            return { type: 'help' };
        } else if (lowerContent === 'all') {
            return { type: 'all' };
        } else {
            return { type: 'unknown' };
        }
    }

    async fetchData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async getCocktailsByFirstLetter(letter) {
        const data = await this.fetchData(`${this.apiConfig.cocktailByFirstLetter}${letter}`);
        return data.drinks ? data.drinks.map(drink => drink.strDrink).join(', ') : 'No cocktails found.';
    }

    async getIngredientByName(name) {
        const data = await this.fetchData(`${this.apiConfig.ingredientByName}${name}`);
        return data.ingredients ? data.ingredients.map(ing => ing.strIngredient).join(', ') : 'No ingredients found.';
    }

    async getRandomCocktail() {
        const data = await this.fetchData(this.apiConfig.randomCocktail);
        return data.drinks ? data.drinks[0].strDrink : 'No cocktail found.';
    }

    async getRandomChuckJoke() {
        const data = await this.fetchData(this.apiConfig.randomChuckJoke);
        return data.value;
    }

    async getChuckJokeByCategory(category) {
        const data = await this.fetchData(`${this.apiConfig.chuckJokeByCategory}${category}`);
        return data.value;
    }

    async getChuckCategories() {
        const data = await this.fetchData(this.apiConfig.chuckCategories);
        return data.join(', ');
    }

    async getRandomUser() {
        const data = await this.fetchData(this.apiConfig.randomUser);
        const user = data.results[0];
        return `Name: ${user.name.first} ${user.name.last}, Gender: ${user.gender}, Nationality: ${user.nat}`;
    }

    async getRandomUserWithParams(params) {
        const data = await this.fetchData(`${this.apiConfig.randomUserWithParams}${params}`);
        const user = data.results[0];
        return JSON.stringify(user);
    }

    async getMultipleUsers(count) {
        if (count > 10) {
            return 'You can get up to 10 users.';
        } else {
            const data = await this.fetchData(`${this.apiConfig.multipleUsers}${count}`);
            return data.results.map(user => `${user.name.first} ${user.name.last}`).join(', ');
        }
        
    }

    async getAll() {
        const [joke, cocktail, user] = await Promise.all([
            this.getRandomChuckJoke(),
            this.getRandomCocktail(),
            this.getRandomUser()
        ]);

        return `Random Joke: ${joke}\nRandom Cocktail: ${cocktail}\nRandom User: ${user}`;
    }

    getCommands() {
        return this.commands.map((command, index) => `${command}: ${this.commandData[index]}`).join('\n');
    }
}
