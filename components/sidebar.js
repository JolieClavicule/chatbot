export const sidebar = (bots) => {
    return `
        <div class="sidebar">
            <p class="tag">Type help to see all available commands</p>
            ${bots.map(bot => `
                <div class="bot-item" data-commands="${bot.getCommands()}">
                    <img src="${bot.image}" alt="${bot.name}" class="bot-image">
                    <span class="bot-name">${bot.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}