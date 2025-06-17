// src/app/Services/socket/socket.service.ts

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes this service available throughout your app
})
export class SocketService {

  constructor(private socket: Socket) {
    // Optional: Log connection status for debugging
    this.socket.fromEvent('connect').subscribe(() => {
      console.log('WebSocket connected to backend!');
    });
    this.socket.fromEvent('disconnect').subscribe(() => {
      console.log('WebSocket disconnected from backend.');
    });
    this.socket.fromEvent('connect_error').subscribe((error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  /**
   * Listens for a specific event from the WebSocket server.
   * @param eventName The name of the event to listen for (e.g., 'pokemonStatusUpdated').
   * @returns An Observable that emits data received from the server.
   */
  on(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);
  }

  /**
   * Emits an event to the WebSocket server.
   * @param eventName The name of the event to emit.
   * @param data The data to send with the event.
   */
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}