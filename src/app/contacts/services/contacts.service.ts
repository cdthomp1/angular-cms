import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  public contacts: Contact[] = [];
  contactSelectedEvent: EventEmitter<Contact> = new EventEmitter<Contact>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts;
  }

  getContact(id: string): Contact {
    return this.contacts.find(c => c.id === id) || null;
  }

}
