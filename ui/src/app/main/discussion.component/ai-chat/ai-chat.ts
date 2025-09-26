import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

declare var apifree: any; // Declare the global object

@Component({
  selector: 'app-ai-chat',
  imports: [FormsModule, CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss'
})
export class AiChatComponent implements OnInit{
  userInput: string = '';
  chatHistory: { sender: string, message: string }[] = [];
  isLoading: boolean = false;
  Status: string = 'Send';

  constructor(private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.chatHistory.push({ sender: 'Kalu', message: 'Hello, my name is Kalu. How can I help you today?' });
  }

  async sendMessage() {
    this.isLoading = true;
    this.Status = "";
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.chatHistory.push({ sender: 'You', message: userMessage });
    this.userInput = '';

    try {
      const aiResponse = await apifree.chat(userMessage);
      this.chatHistory.push({ sender: 'Kalu', message: aiResponse });
      this.isLoading = false;
      this.Status = 'Send';
      this.cdr.detectChanges();
    } catch (error) {
      this.chatHistory.push({ sender: 'Kalu', message: 'Error getting response from AI.' });
      this.isLoading = false;
      this.Status = 'Send';
      this.cdr.detectChanges();
      console.error('API error:', error);
    }
  }
}
