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
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', (event) => {
        this.resize();
      });
      this.resize();
    }
  }
  private resize() {
    // TODO: Also check if on mobile, mobile interface will be slightly different
    // Need a service that handles this & is mobile, clean it up
    // On mobile show formatting toolbar above soft keyboard, on desktop show at top

    // Somewhat works, but I can scroll the excess space into view
    // Need to fix... ensure the total height is reduced.

    // TODO: If the visual viewport matches the layout viewport, don't set the height (will default to 100% based on CSS)
    let height = '';
    if (window.visualViewport) {
      const visualHeight = (<any>window)[<any>'testVisualViewport'] ? window.visualViewport.height / 2 : window.visualViewport.height;
      const delta = visualHeight - window.innerHeight;
      if (Math.abs(delta) >= 1 && visualHeight >= 1) {
        height = `${visualHeight}px`;
      }
    }
    //this.visualViewportHeight = heightPx;
    document.body.style.height = height;
    document.documentElement.style.height = height;
  }
}
