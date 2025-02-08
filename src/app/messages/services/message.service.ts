import { EventEmitter, Injectable } from '@angular/core';
import { Message } from '../../models/message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find(msg => msg.id === id) || null;
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }
}
