import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../../models/document.model';
import { DocumentService } from '../services/document-service.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  subscription: Subscription;

  constructor(private documentService: DocumentService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Initialize the documents array
    this.documents = this.documentService.getDocuments();

    // Subscribe to changes in the document list using the Subject
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        console.log('EVENT', documents);
        this.documents = documents;
        // Force Angular to check for changes and update the UI
        this.cdr.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }

  onSelectedDocument(document: Document): void {
    this.documentService.documentSelectedEvent.emit(document);
  }
}
