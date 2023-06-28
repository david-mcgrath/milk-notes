import { Injectable } from '@angular/core';
import { Note, NotePreview } from '../types/note';
import { Storage } from '@ionic/storage-angular';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private notes: Note[] = [];
  private _loaded = false;
  get loaded(): boolean {
    return this._loaded;
  }

  constructor(private storage: Storage) { }

  load(): Promise<boolean> {
    return new Promise((resolve) => {
      this.storage.create().then((storage) => {
        storage.get('notes').then((notes) => {
          this.notes = notes || [];
          this._loaded = true;
          this.generateTitles();
          resolve(true);
        });
      });
    })
  }
  save(): void {
    this.generateTitles();
    this.storage.set('notes', this.notes);
  }
  getNote(id: string): Note {
    let note = this.notes.find((note) => note.id === id);
    if (!note) {
      throw new Error('Could not load note...');
    }
    return note;
  }
  createNote(note?: Partial<Note>): Note {
    const createdNote = {
      id: note?.id || Guid.create().toString(),
      title: note?.title || '',
      content: note?.content || '',
    };
    this.notes.push(createdNote);
    this.save();
    return createdNote;
  }
  deleteNote(note: Note): void {
    const index = this.notes.indexOf(note);
    if (index > -1) {
      this.notes.splice(index, 1);
      this.save();
    }
  }
  list(): NotePreview[] {
    return this.notes.map((note) => ({
      id: note.id,
      title: note.title,
    }));
  }

  private generateTitles(): void {
    this.notes.forEach((note) => {
      note.title = note?.content?.split('\n').find((line) => line.trim())?.trim() || 'New note...';
    });
  }
}
