import { Component } from '@angular/core';
import { Document } from '../models/document.model';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
  selectedDocument: Document;

  onSelectedDocument(document: Document) {
    this.selectedDocument = document;
  }
}
