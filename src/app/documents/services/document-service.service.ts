import { Injectable, EventEmitter } from '@angular/core';
import { Document } from '../../models/document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // An array to hold all Document objects
  documents: Document[] = [];

  // EventEmitter for cross-component communication (e.g., notifying when a document is selected)
  documentSelectedEvent: EventEmitter<Document> = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  constructor() {
    // Initialize the documents array with the predefined mock documents
    this.documents = MOCKDOCUMENTS;
  }

  // Returns a copy of the documents array to ensure the original array isn't modified
  getDocuments(): Document[] {
    return this.documents.slice();
  }

  // Returns a specific document based on the provided id.
  // If no matching document is found, returns null.
  getDocument(id: string): Document {
    return this.documents.find(doc => doc.id === id) || null;
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    // Emit a new copy of the documents array
    this.documentChangedEvent.emit(this.documents.slice());
  }
}
