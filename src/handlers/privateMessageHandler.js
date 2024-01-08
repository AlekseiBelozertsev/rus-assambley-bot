import { data } from "../data/data.js";
export class PrivateMessageHandler {
  constructor(ctx, chatId) {
    this.ctx = ctx;
    this.chatId = chatId;
  }
  async HandlePrivateMessage() {
    try {
      await this.ctx.telegram.sendMessage(
        this.chatId,
        `Cообщение от ${this.ctx.from.first_name}: ${this.ctx.message.text}`
      );
      await this.ctx.reply(data.sendMessage);
    } catch (error) {
      console.error(
        data.eternalError,
        error
      );
      await this.ctx.reply(data.eternalError);
    }
  }
}