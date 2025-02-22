import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from '../../models/document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // An array to hold all Document objects
  documents: Document[] = [];

  // EventEmitter for when a document is selected (child-to-parent communication)
  documentSelectedEvent: EventEmitter<Document> = new EventEmitter<Document>();

  // Subject to emit changes when the documents list is modified (add, update, delete)
  documentListChangedEvent = new Subject<Document[]>();

  // Keeps track of the maximum document id to generate unique ids for new documents
  maxDocumentId: number;

  constructor() {
    // Initialize the documents array with the predefined mock documents
    this.documents = MOCKDOCUMENTS;
    // Determine the maximum id among existing documents
    this.maxDocumentId = this.getMaxId();
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

  // Returns the maximum id currently used in the documents array
  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Adds a new document to the documents array and emits the updated list
  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    // Emit a new copy of the documents array using the Subject's next() method
    this.documentListChangedEvent.next(this.documents.slice());
  }

  // Updates an existing document in the documents array and emits the updated list
  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    // Preserve the original document's id
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    // Emit a new copy of the documents array
    this.documentListChangedEvent.next(this.documents.slice());
  }

  // Deletes a document from the documents array and emits the updated list
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
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
