import { Component, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e:any): void {
        this.sidebarRef.close(e);
    }

}
