import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

declare var apifree: any; // Declare the global object

@Component({
  selector: 'app-ai-chat',
  imports: [FormsModule, CommonModule, MatButtonModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss'
})
export class AiChatComponent {
  userInput: string = '';
  chatHistory: { sender: string, message: string }[] = [];

  constructor(private cdr: ChangeDetectorRef){}

  async sendMessage() {
    debugger;
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.chatHistory.push({ sender: 'You', message: userMessage });
    this.userInput = '';

    try {
      const aiResponse = await apifree.chat(userMessage);
      this.chatHistory.push({ sender: 'AI', message: aiResponse });
      this.cdr.detectChanges();
    } catch (error) {
      this.chatHistory.push({ sender: 'AI', message: 'Error getting response from AI.' });
      this.cdr.detectChanges();
      console.error('API error:', error);
    }
  }
}
