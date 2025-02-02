import { Component, Input } from '@angular/core';
import { Document } from '../../models/document.model';
@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.css'
})
export class DocumentItemComponent {
  @Input() document: Document;
}
