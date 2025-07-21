import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-comment-form',
  imports: [],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css',
})
export class CommentForm {
  placeholder = input<string>('Write something...');
  buttonText = input<string>('Create');
  formSubmitted = output<{ text: string }>();

  formSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const content = form.elements.namedItem('input-box') as HTMLTextAreaElement;
    const contentValue = content.value.trim();

    if (contentValue) {
      // Emit the content to the parent component or handle it here
      console.log('Comment submitted:', contentValue);
      this.formSubmitted.emit({ text: contentValue });
    } else {
      console.warn('Comment cannot be empty');
    }

    form.reset(); // Reset the form after submission
  }
}
