import {
  Component,
  input,
  output,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';

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
  isLoading = signal(false);

  @ViewChild('inputBoxRef') inputBoxRef!: ElementRef<HTMLTextAreaElement>;

  async generateWithAI() {
    this.isLoading.set(true);

    try {
      const prompt = `Write a short social media post in a fun, relatable tone. Keep it within 280 characters.`;

      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyA0nHw39pi7w1T0Z-qvs-nadUSxydLn8vw', // Replace with env variable
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiContent) {
        this.inputBoxRef.nativeElement.value = aiContent;
      } else {
        alert('AI failed to generate content.');
      }
    } catch (err) {
      console.error('AI error:', err);
      alert('Something went wrong with AI generation.');
    } finally {
      this.isLoading.set(false);
    }
  }

  formSubmit(event: Event) {
    event.preventDefault();
    const content = this.inputBoxRef?.nativeElement?.value?.trim();

    if (content) {
      this.formSubmitted.emit({ text: content });
    } else {
      console.warn('Comment cannot be empty');
    }

    this.inputBoxRef.nativeElement.value = '';
    this.isLoading.set(false);
  }
}
