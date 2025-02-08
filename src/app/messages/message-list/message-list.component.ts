import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
    this.messageService.messageChangedEvent.subscribe(
      (updatedMessages: Message[]) => {
        this.messages = updatedMessages;
      }
    );
  }

}
