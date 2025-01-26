import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {

  @Input() contacts: Contact[];
  @Output() selectedContactIdEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {

  }

  onSelectContact(contact: Contact) {
    this.selectedContactIdEvent.emit(contact.id)
  }
}
