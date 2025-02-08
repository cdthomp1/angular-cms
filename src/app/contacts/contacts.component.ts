import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactsService } from './services/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {

  public selectedContactId: string;
  public selectedContact: Contact;

  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
    this.contactsService.contactSelectedEvent.subscribe((contact: Contact) => {
      this.selectedContact = contact;
    });
  }

}

