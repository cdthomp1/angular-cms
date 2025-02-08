import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { ContactsService } from '../../contacts/services/contacts.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string = '';

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    // Use the ContactService to get the contact based on the sender ID.
    const contact: Contact = this.contactsService.getContact(this.message.sender);
    this.messageSender = contact ? contact.name : 'Unknown Sender';
  }
}
