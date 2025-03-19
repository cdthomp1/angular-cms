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

  // NodeJS backend URL for documents
  private documentsUrl: string = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
    this.getDocuments(); // Load documents initially
  }


  getDocuments(): Document[] {
    this.http.get<{ message: string, documents: Document[] }>(this.documentsUrl).subscribe(
      (response) => {
        this.documents = response.documents ? response.documents : [];
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


  getDocument(id: string): Document {
    return this.documents.find(doc => doc.id === id) || null;
  }

  // Helper method to determine the maximum id currently used.
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


  storeDocuments(): void {
    const documentsString = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.documentsUrl, documentsString, { headers: headers }).subscribe(
      () => {
        console.log('Documents successfully stored.');
        // Optionally re-fetch to update local state:
        this.getDocuments();
      },
      (error: any) => {
        console.error('Error storing documents:', error);
      }
    );
  }


  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ message: string, document: Document }>(this.documentsUrl, newDocument, { headers: headers })
      .subscribe(
        (response) => {

          this.documents.push(response.document);
          this.maxDocumentId = this.getMaxId();
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.error('Error adding document:', error);
        }
      );
  }


  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }
    newDocument.id = originalDocument.id; // Preserve original id
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(`${this.documentsUrl}/${originalDocument.id}`, newDocument, { headers: headers })
      .subscribe(
        () => {
          const pos = this.documents.findIndex(doc => doc.id === originalDocument.id);
          if (pos !== -1) {
            this.documents[pos] = newDocument;
            this.documentListChangedEvent.next(this.documents.slice());
          }
        },
        (error: any) => {
          console.error('Error updating document:', error);
        }
      );
  }


  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    this.http.delete(`${this.documentsUrl}/${document.id}`)
      .subscribe(
        () => {
          const pos = this.documents.findIndex(doc => doc.id === document.id);
          if (pos !== -1) {
            this.documents.splice(pos, 1);
            this.documentListChangedEvent.next(this.documents.slice());
          }
        },
        (error: any) => {
          console.error('Error deleting document:', error);
        }
      );
  }
}
