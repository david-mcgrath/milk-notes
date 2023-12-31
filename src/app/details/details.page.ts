import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Note } from '../types/note';
import { ActivatedRoute } from '@angular/router';
import { NotesService } from '../services/notes.service';
import { MilkdownComponent } from '../components/milkdown/milkdown.component';
import { animate, trigger, transition, style } from '@angular/animations';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MilkdownComponent],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('150ms ease-in-out', style({ opacity: 0, transform: 'translateY(100%)' })),
      ]),
    ])
  ]
})
export class DetailsPage implements OnInit {
  note: Note;
  loaded: boolean;
  focused: boolean;

  constructor(private route: ActivatedRoute, private notesService: NotesService, private navCtrl: NavController) {
    this.note = {
      id: '',
      title: '',
      content: '',
    };
    this.loaded = false;
    this.focused = false;
  }

  ngOnInit(): void {
    const noteId = this.route.snapshot.paramMap.get('id');

    if (!noteId) {
      throw new Error('No note id provided.');
    }

    if (this.notesService.loaded) {
      this.note = this.notesService.getNote(noteId);
      this.loaded = true;
    }
    else {
      this.notesService.load().then(() => {
        this.note = this.notesService.getNote(noteId);
        this.loaded = true;
      });
    }
  }

  saveNote() {
    if (this.loaded) {
      this.notesService.save();
    }
  }
  deleteNote() {
    if (this.loaded) {
      this.notesService.deleteNote(this.note);
    }
    this.navCtrl.navigateBack('/notes');
  }
}
