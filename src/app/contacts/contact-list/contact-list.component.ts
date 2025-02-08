import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {

  contacts: Contact[]
  @Output() selectedContactIdEvent = new EventEmitter<string>();

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.contacts = this.contactsService.getContacts();
  }

  onSelectContact(contact: Contact) {
    this.contactsService.contactSelectedEvent.emit(contact)
  }
}
