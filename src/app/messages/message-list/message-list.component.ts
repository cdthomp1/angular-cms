import { Component } from '@angular/core';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Test Subject 1', 'This is the first test message.', 'John Doe'),
    new Message('2', 'Test Subject 2', 'This is the second test message.', 'Jane Doe'),
    new Message('3', 'Test Subject 3', 'This is the third test message.', 'Bob Smith')
  ];

  onAddMessage(message: Message) {
    console.log("MESSAGE RECIEVED", message)
    this.messages.push(message);

  }
}
