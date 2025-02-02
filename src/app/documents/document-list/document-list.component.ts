import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../../models/document.model';
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  documents: Document[] = [
    new Document("1", 'Document 1', 'Description 1', 'https://example.com/doc1'),
    new Document("2", 'Document 2', 'Description 2', 'https://example.com/doc2'),
    new Document("3", 'Document 3', 'Description 3', 'https://example.com/doc3'),
    new Document("4", 'Document 4', 'Description 4', 'https://example.com/doc4')
  ];

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  onSelectedDocument(document: Document) {
    console.log(document)
    this.selectedDocumentEvent.emit(document);
  }
}
