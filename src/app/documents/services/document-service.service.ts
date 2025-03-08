import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Document } from '../../models/document.model';

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

  // Firebase URL for documents – ensure there is only one slash before 'documents.json'
  private documentsUrl: string = 'https://angular-cms-7dba6-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
  }

  // Retrieves documents from Firebase via HTTP GET
  getDocuments(): Document[] {
    this.http.get<Document[]>(this.documentsUrl).subscribe(
      (documents: Document[]) => {
        this.documents = documents ? documents : [];
        this.maxDocumentId = this.getMaxId();
        // Sort documents by name (assumes Document has a 'name' property)
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Error fetching documents:', error);
      }
    );
    return this.documents.slice();
  }

  // Returns a specific document based on the provided id; returns null if not found
  getDocument(id: string): Document {
    return this.documents.find(doc => doc.id === id) || null;
  }

  // Helper method to determine the maximum id currently used
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

  // Persists the documents array to Firebase via HTTP PUT
  // Persists the documents array to Firebase via HTTP PUT
  storeDocuments(): void {
    const documentsString = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.documentsUrl, documentsString, { headers: headers }).subscribe(
      () => {
        console.log('Documents successfully stored.');
        // After storing, re-fetch the documents from Firebase
        this.http.get<Document[]>(this.documentsUrl).subscribe(
          (documents: Document[]) => {
            this.documents = documents ? documents : [];
            this.maxDocumentId = this.getMaxId();
            // Sort documents by name (assumes Document has a 'name' property)
            this.documents.sort((a, b) => a.name.localeCompare(b.name));
            this.documentListChangedEvent.next(this.documents.slice());
          },
          (error: any) => {
            console.error('Error fetching documents after storing:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error storing documents:', error);
      }
    );
  }


  // Adds a new document, assigns a unique id, and persists the updated list
  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    console.log('Local documents after push:', this.documents);
    this.storeDocuments();
  }


  // Updates an existing document and persists the updated list
  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id; // Preserve original id
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  // Deletes a document and persists the updated list
  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
