import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  public contacts: Contact[];
  public selectedContactId: string;
  public selectedContact: Contact;

  ngOnInit() {
    this.contacts = [
      new Contact(
        "1",
        "R. Kent Jackson",
        "jacksonk@byui.edu",
        "208-496-3771",
        "images/jacksonk.jpg",
        []
      ),
      new Contact(
        "2",
        "Rex Barzee",
        "barzeer@byui.edu",
        "208-496-3768",
        "images/barzeer.jpg",
        []
      )
    ]
  }

  public setSelectedContactId($event) {
    console.log($event)
    this.selectedContactId = $event;
    this.setSelectedContact();
  }

  private setSelectedContact() {
    this.selectedContact = this.contacts.find(c => c.id === this.selectedContactId);
  }
}

