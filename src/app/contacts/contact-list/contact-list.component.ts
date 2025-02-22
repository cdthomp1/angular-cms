import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../../models/contact.model';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[];
  subscription: Subscription;
  @Output() selectedContactIdEvent = new EventEmitter<string>();

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    // Initialize the contacts array
    this.contacts = this.contactsService.getContacts();

    // Subscribe to changes in the contacts array using the Subject
    this.subscription = this.contactsService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }

  onSelectContact(contact: Contact): void {
    this.contactsService.contactSelectedEvent.emit(contact);
  }
}
