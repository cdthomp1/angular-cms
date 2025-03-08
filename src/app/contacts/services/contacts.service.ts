import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from '../../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  public contacts: Contact[] = [];
  contactSelectedEvent: EventEmitter<Contact> = new EventEmitter<Contact>();

  // Subject to emit a copy of the updated contacts list whenever changes occur
  contactListChangedEvent = new Subject<Contact[]>();

  // Keeps track of the maximum contact id to generate unique ids for new contacts
  maxContactId: number;

  // Firebase URL for contacts – update this with your actual Firebase URL
  private contactsUrl: string = 'https://angular-cms-7dba6-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  // Retrieves contacts from Firebase via HTTP GET
  getContacts(): Contact[] {
    this.http.get<Contact[]>(this.contactsUrl).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts ? contacts : [];
        this.maxContactId = this.getMaxId();
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      }
    );
    return this.contacts.slice();
  }

  // Returns a specific contact based on its id; returns null if not found
  getContact(id: string): Contact {
    return this.contacts.find(c => c.id === id) || null;
  }

  // Helper method to determine the maximum id in the contacts list
  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Persists the contacts array to Firebase via HTTP PUT
  storeContacts(): void {
    const contactsString = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.contactsUrl, contactsString, { headers: headers }).subscribe(
      () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error storing contacts:', error);
      }
    );
  }

  // Adds a new contact, assigns a unique id, and persists the updated list
  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  // Updates an existing contact and persists the updated list
  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id; // Preserve original id
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  // Deletes a contact and persists the updated list
  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts();
  }
}
