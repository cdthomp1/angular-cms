import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../../models/document.model';
import { DocumentService } from '../services/document-service.service';
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    // Initialize the documents array
    this.documents = this.documentService.getDocuments();

    // Subscribe to changes in the document list
    this.documentService.documentChangedEvent.subscribe(
      (documents: Document[]) => {
        this.documents = documents;
      }
    );
  }

  onSelectedDocument(document: Document): void {
    this.documentService.documentSelectedEvent.emit(document);
  }
}
