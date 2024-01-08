import { PrivateMessageHandler } from "./privateMessageHandler.js";
import { ReplyMessageHandler } from "./replyMessageHandler.js";

export class MessageHandler {
  constructor(
    ctx,
    data,
    chatId,
    ) {
    this.ctx = ctx;
    this.data = data;
    this.chatId = chatId;
  };
  
  HandlePrivateMessage() {
    const privateMessageHandler = new PrivateMessageHandler(this.ctx, this.chatId);
    privateMessageHandler.HandlePrivateMessage();
  }

  HandleReplyMessage(userId) {
    const replyMessageHandler = new ReplyMessageHandler(this.ctx, this.chatId);
    replyMessageHandler.HandleReplyMessage(userId);
  }
}