import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from '../../models/document.model';
import { DocumentService } from '../services/document-service.service';
import { WindRefService } from '../services/wind-ref.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private windRefService: WindRefService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.document = this.documentService.getDocument(id);
    });
  }

  onView(): void {
    if (this.document && this.document.url) {
      const nativeWindow = this.windRefService.getNativeWindow();
      nativeWindow.open(this.document.url);
    }
  }

  onDelete(): void {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
}
