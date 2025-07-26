import { Component, OnInit, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { StorageKey } from 'src/app/constent/storage-key';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  protected isLoading = this.loaderService.isLoading;
  protected roleSet: Set<any> = new Set()

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;



  sidebarItems = [
    {label:'Create Vendor'},
    {label:'Vendors'},
    {label:'Employee'}, 
    {label:'QR Order'},
    {label:'Ongoing Order'},
    {label:'Product'},
    {label:'TableOrder'},
    {label:'Create Offer'},
    {label:'OrderHistory'},
    {label:'Analytics'},
    {label:'Feedback'},
    {label:'Kitchen'}
  ];



  selectedItem: string | null = null;
  constructor(private localStorage: SecureLocalStorageService, private loaderService: LoaderService) { }

  ngOnInit(): void {

    let user = JSON.parse(this.localStorage.decryptAndGet(StorageKey.USER) || 'null')
    if (user) {
      let roles = user.role;
      for (let i of roles) {
        this.roleSet.add(i);
      }
    }

    const elem = document.documentElement;
    if (this.roleSet.has('COOK')) {
      document.addEventListener('click', this.enterFullscreenOnce);
      // Auto-reenter if fullscreen exits
      document.addEventListener('fullscreenchange', this.handleFullscreenExit);
    }
  }

  // closeCallback(e: any): void {
  //   this.sidebarRef.close(e);
  // }




  selectItem(item: string) {
    this.selectedItem = item;
  }

  enterFullscreenOnce = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen && !document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    }
    // Remove listener after entering fullscreen once
    document.removeEventListener('click', this.enterFullscreenOnce);
  };

  handleFullscreenExit = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement && this.roleSet.has('COOK')) {
      // Wait for a moment to allow potential user action
      setTimeout(() => {
        elem.requestFullscreen?.().catch(err => {
          console.warn('Could not re-enter fullscreen:', err);
        });
      }, 300); // small delay
    }
  };

}
