export const sidebar = (bots) => {
    return `
        <div class="sidebar">
            <p class="tag is-info is-light">Type help to see all available commands</p>
            <p class="tag is-info is-light">Type all to get a cocktail, a joke and a user</p>
            ${bots.map(bot => `
                <div class="bot-item" data-commands="${bot.getCommands()}">
                    <img src="${bot.image}" alt="${bot.name}" class="bot-image">
                    <span class="bot-name">${bot.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}