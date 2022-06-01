import { Injectable } from '@angular/core';

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  validRequest: boolean;
  toastMsg: HTMLElement | null;
  error?: ResponseError;

  constructor() {
    this.validRequest = false;
    this.toastMsg = null;
  }

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ResponseError
  ): Promise<void> {
    this.toastMsg = document.getElementById(element);
    this.validRequest = validRequest;
    this.error = error;
    if (this.toastMsg) {
      this.processToast();
      await this.wait(2500);
      this.toastMsg.className = this.toastMsg.className.replace('show', '');
    }
  }

  private processToast(): void {
    if (this.validRequest) {
      this.showMessage('show requestOk', 'Info submitted successfully.');
    } else {
      this.showMessage('show requestKo', this.makeErrorMessage());
    }
  }

  private makeErrorMessage(): string {
    if (this.error?.messageDetail) {
      return 'Your username or password are not correct.';
    } else {
      return 'Your username or password are not correct.';
    }
  }

  private showMessage(className: string, textContent: string) {
    if (this.toastMsg) {
      this.toastMsg.className = className;
      this.toastMsg.textContent = textContent;
    }
  }

  errorLog(error: ResponseError): void {
    console.error('path:', error.path);
    console.error('timestamp:', error.timestamp);
    console.error('message:', error.message);
    console.error('messageDetail:', error.messageDetail);
    console.error('statusCode:', error.statusCode);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
