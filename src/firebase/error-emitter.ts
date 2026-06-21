'use client';

type ErrorEventListener = (error: any) => void;

class ErrorEmitter {
  private listeners: { [event: string]: ErrorEventListener[] } = {};

  on(event: string, listener: ErrorEventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  emit(event: string, error: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(error));
    }
  }

  off(event: string, listener: ErrorEventListener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  }
}

export const errorEmitter = new ErrorEmitter();
