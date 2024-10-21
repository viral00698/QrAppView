import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { OrderComponent } from './menu/order/order.component';
import {MatIconModule} from '@angular/material/icon';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ProductComponent } from './menu/product/product.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OngoingComponent } from './menu/ongoing/ongoing.component';
import { ProductAnalyticsComponent } from './menu/product-analytics/product-analytics.component';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { LoginComponent } from './login/login/login.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { HTTP_INTERCEPTORS, HttpClientModule ,HttpClientXsrfModule} from '@angular/common/http';
import { BaseUrlInterceptor } from './auth/base-url.interceptor';
import { RxStompService } from './services/rx-stomp.service';
import { SocketConfigService } from './services/socket-config.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InplaceModule } from 'primeng/inplace';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableOrdersComponent } from './table-orders/table-orders.component';
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    OrderComponent,
    ProductComponent,
    OngoingComponent,
    ProductAnalyticsComponent,
    LoginComponent,
    TableOrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    MatIconModule,
    CardModule,
    TooltipModule,
    PanelModule,
    MultiSelectModule,
    TableModule,
    DividerModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    KnobModule,
    CalendarModule,
    DropdownModule,
    InputSwitchModule,
    InputTextareaModule,
    FileUploadModule,
    HttpClientModule,
    HttpClientModule,
    SelectButtonModule,
    InplaceModule,
    ToastModule,
    AvatarModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',  // Name of the cookie with the CSRF token
      headerName: 'X-XSRF-TOKEN'  // Name of the header to send the token in
    })
    

  ],
  providers: [
    MessageService,
    RxStompService,
    SocketConfigService,
    {provide:HTTP_INTERCEPTORS , useClass:BaseUrlInterceptor ,multi:true}
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
