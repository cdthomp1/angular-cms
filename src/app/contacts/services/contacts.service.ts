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
  maxContactId: number = 0;

  // NodeJS backend URL for contacts
  private contactsUrl: string = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
    this.getContacts(); // load contacts from the backend on initialization
  }

  getContacts(): Contact[] {
    this.http.get<{ message: string, contacts: Contact[] }>(this.contactsUrl).subscribe(
      (responseData) => {
        this.contacts = responseData.contacts ? responseData.contacts : [];
        this.maxContactId = this.getMaxId();
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      }
    );
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find(c => c.id === id) || null;
  }


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

  storeContacts(): void {
    this.getContacts();
  }

  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ message: string, contact: Contact }>(this.contactsUrl, newContact, { headers: headers })
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          this.maxContactId = this.getMaxId();
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error adding contact:', error);
        }
      );
  }


  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(`${this.contactsUrl}/${originalContact.id}`, newContact, { headers: headers })
      .subscribe(
        () => {
          this.contacts[pos] = newContact;
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error updating contact:', error);
        }
      );
  }


  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.http.delete(`${this.contactsUrl}/${contact.id}`)
      .subscribe(
        () => {
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error deleting contact:', error);
        }
      );
  }
}
