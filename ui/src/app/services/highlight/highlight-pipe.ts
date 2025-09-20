import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchText: string): SafeHtml {
    if (!searchText) return value;

    const regex = new RegExp(`(${searchText})`, 'gi');
    const newValue = value.replace(regex, `<span class="highlight">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(newValue);
  }
}
