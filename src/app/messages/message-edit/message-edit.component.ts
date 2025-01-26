import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgText') msgTextInput!: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = 'YourName';

  onSendMessage(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior

    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;

    if (!subject || !msgText) return;

    const newMessage = new Message(
      'id-' + Math.random(), // Unique ID
      subject,
      msgText,
      this.currentSender
    );

    this.addMessageEvent.emit(newMessage);
    this.onClear(); // Clear the inputs after sending
  }

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}
