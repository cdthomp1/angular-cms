import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgText') msgTextInput!: ElementRef;

  currentSender: string = 'YourName';

  constructor(private messageService: MessageService) {}

  onSendMessage(event: Event) {
    event.preventDefault();

    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;

    if (!subject || !msgText) return;

    const newMessage = new Message(
      'id-' + Math.random(),
      subject,
      msgText,
      this.currentSender
    );


    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}
