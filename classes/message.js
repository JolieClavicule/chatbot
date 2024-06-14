export class Message {
    constructor(sender, content) {
        this.sender = sender;
        this.content = content;
        this.timestamp = new Date();
    }

    toJSON() {
        return {
            sender: this.sender,
            content: this.content,
            timestamp: this.timestamp.toISOString()
        };
    }

    render() {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'is-info', 'has-text-left');

        if (this.sender === 'User') {
            messageElement.classList.add('sender-message');
        } else {
            messageElement.classList.add('receiver-message');
        }

        const headerHtml = this.sender !== 'User' ? `
            <div class="message-header">
                <figure class="image">
                    <img class="is-rounded" src="${this.sender.image}" />
                </figure>
                    <strong>${this.sender.name || this.sender},</strong>
                    <small>${this.timestamp.toLocaleTimeString()}</small>
            </div>` : `
            <div class="message-header">
                <small>${this.timestamp.toLocaleTimeString()}</small>
            </div>`;

        messageElement.innerHTML = `
            <div class="message-container">
                ${headerHtml}
                <div class="message-body">
                    ${this.content}
                </div>
            </div>`;

        return messageElement;
    }
}