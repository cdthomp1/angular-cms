import { Component, Input } from '@angular/core';
import { Document } from '../../models/document.model';
@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent {
  @Input() document: Document;
}
