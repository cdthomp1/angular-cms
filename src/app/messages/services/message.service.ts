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

  // NodeJS backend URL for messages
  private messagesUrl: string = 'http://localhost:3000/messages';

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


  getMessages(): Message[] {
    this.http.get<{ message: string, messages: Message[] }>(this.messagesUrl).subscribe(
      (response) => {
        this.messages = response.messages ? response.messages : [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
      }
    );
    return this.messages.slice();
  }


  getMessage(id: string): Message {
    return this.messages.find(msg => msg.id === id) || null;
  }


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


  addMessage(message: Message): void {
    if (!message) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ message: string, messageData: Message }>(this.messagesUrl, message, { headers: headers })
      .subscribe(
        (response) => {
          this.messages.push(response.messageData);
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error: any) => {
          console.error('Error adding message:', error);
        }
      );
  }
}
