import { data } from "../data/data.js";

export class ReplyMessageHandler {
  constructor(ctx, chatId) {
    this.ctx = ctx;
    this.chatId = chatId;
  }
  async HandleReplyMessage(userId) {
    await this.ctx.telegram.copyMessage(
      userId,
      this.chatId,
      this.ctx.message.message_id
    );
    await this.ctx.telegram.sendMessage(this.chatId, data.sendMessage);
  }
}