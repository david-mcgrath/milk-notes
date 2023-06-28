import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { NotesService } from '../services/notes.service';
import { NotePreview } from '../types/note';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class HomePage implements OnInit {
  notes: NotePreview[] = [];
  loaded: boolean = false;

  constructor(private notesService: NotesService, private alertCtrl: AlertController, private navCtrl: NavController) {}
  ngOnInit(): void {
    this.notesService.load().then(() => {
      this.notes = this.notesService.list();
      this.loaded = true;
    });
  }
  addNote(): void {
    if (this.notesService.loaded) {
      const note = this.notesService.createNote();
      this.navCtrl.navigateForward('/notes/' + note.id);
    }
  }
}
