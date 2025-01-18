import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  public contact: Contact;

  constructor() { }

  ngOnInit(): void {
    // this.contact = new Contact(
    //   "1",
    //   "R. Kent Jackson",
    //   "jacksonk@byui.edu",
    //   "208-496-3771",
    //   "images/jacksonk.jpg",
    //   []
    // )
  }
}
