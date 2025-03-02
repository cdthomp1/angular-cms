import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Document } from '../../models/document.model';
import { DocumentService } from '../services/document-service.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  id: string;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.editMode = false;
        // Initialize a new Document for adding a new one.
        this.document = new Document('', '', '', '', []);
        return;
      }
      this.originalDocument = this.documentService.getDocument(this.id);
      if (!this.originalDocument) {
        return;
      }
      this.editMode = true;
      // Clone the original document so changes do not affect it directly.
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    // Create a new Document object (adjust parameters as needed)
    const newDocument = new Document(Math.random().toString(), value.name, value.description, value.url, []);
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    console.log(this.documentService.getDocuments());
    this.router.navigate(['/documents']);
  }

  onCancel(): void {
    this.router.navigate(['/documents']);
  }
}
