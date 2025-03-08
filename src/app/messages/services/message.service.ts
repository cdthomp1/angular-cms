import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId: number;

  messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();

  // Firebase URL for messages – update with your actual Firebase URL
  private messagesUrl: string = 'https://angular-cms-7dba6-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {
    this.maxMessageId = this.getMaxId();
  }

  // Helper method to determine the maximum id in the messages list
  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Retrieves messages from Firebase via HTTP GET
  getMessages(): Message[] {
    this.http.get<Message[]>(this.messagesUrl).subscribe(
      (messages: Message[]) => {
        this.messages = messages ? messages : [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
      }
    );
    return this.messages.slice();
  }

  // Returns a specific message based on its id; returns null if not found
  getMessage(id: string): Message {
    return this.messages.find(msg => msg.id === id) || null;
  }

  // Persists the messages array to Firebase via HTTP PUT
  storeMessages(): void {
    const messagesString = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.messagesUrl, messagesString, { headers: headers }).subscribe(
      () => {
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error storing messages:', error);
      }
    );
  }

  // Adds a new message, assigns a unique id, and persists the updated list
  addMessage(message: Message): void {
    if (!message) {
      return;
    }
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }
}
