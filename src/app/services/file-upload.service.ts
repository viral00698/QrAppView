import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  imageBase64!: any

  constructor() { }

    async onUpload(event: Event):Promise<any> {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length) {
      const file = target.files[0];
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        return this.convertToBase64(file)
      } else {
        console.error('Please select an image file.');
      }
    }
  }

  async convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      // resolve(reader.result as string);
      const base64 = (reader.result as string).split(',')[1]; // remove the prefix
      resolve(base64);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}

}
