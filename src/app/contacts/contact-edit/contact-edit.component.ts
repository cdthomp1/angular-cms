import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Contact } from '../../models/contact.model';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  // Initialize contact so two-way binding works without using safe navigation
  contact: Contact = { id: '', name: '', email: '', phone: '', imageUrl: '', group: [] };
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if (!this.originalContact) {
        return;
      }
      this.editMode = true;
      // Clone the original contact to avoid direct mutation
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.contact.group) {
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newContact: Contact = {
      id: this.editMode ? this.contact.id : this.generateId(), // Implement generateId() as needed
      name: value.name,
      email: value.email,
      phone: value.phone,
      imageUrl: value.imageUrl,
      group: this.groupContacts
    };
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);
  }

  onCancel(): void {
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  onDrop(event: CdkDragDrop<Contact[]>): void {
    // Retrieve the dropped contact from the event.
    // Note: Ensure that the draggable element in the other component supplies the correct data.
    const droppedContact: Contact = event.item.data;
    if (this.isInvalidContact(droppedContact)) {
      return;
    }
    this.groupContacts.push(droppedContact);
  }

  onRemoveItem(index: number): void {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }

  generateId(): string {
    // Simple ID generator; replace with your own logic if needed.
    return Math.random().toString(36).substring(2, 15);
  }
}
