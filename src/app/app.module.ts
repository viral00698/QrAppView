import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TestComponent } from './test/test.component';
import { Test1Component } from './test1/test1.component';
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
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TestComponent,
    Test1Component,
    NavbarComponent,
    OrderComponent,
    ProductComponent,
    OngoingComponent,
    ProductAnalyticsComponent,
    LoginComponent,
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
    FileUploadModule
    
    
  ],
  providers: [
    //  {
    //   provide: RxStompService,
    //   useFactory:rxStompServiceFactory
    //  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
