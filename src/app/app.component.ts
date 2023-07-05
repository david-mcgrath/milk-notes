import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, IonicStorageModule],
})
export class AppComponent {
  visualViewportHeight: string | null = null;
  constructor() {
    // TODO: Also check if on mobile, mobile interface will be slightly different
    // Need a service that handles this & is mobile, clean it up
    // On mobile show formatting toolbar above soft keyboard, on desktop show at top

    // Somewhat works, but I can scroll the excess space into view
    // Need to fix... ensure the total height is reduced.s
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', (event) => {
        const height = window.visualViewport?.height;
        if (height) {
          const heightPx = `${height}px`;
          this.visualViewportHeight = heightPx;
          document.body.style.height = heightPx;
        }
        else {
          document.body.style.height = '';
        }
      });
    }
  }
}
