import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {

  public contacts: Contact[];

  constructor() { }

  ngOnInit(): void {
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
}
