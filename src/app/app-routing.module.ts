import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './menu/order/order.component';
import { ProductComponent } from './menu/product/product.component';
import { OngoingComponent } from './menu/ongoing/ongoing.component';
import { ProductAnalyticsComponent } from './menu/product-analytics/product-analytics.component';
import { LoginComponent } from './login/login/login.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { authGuard } from './gard/auth.guard';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TableOrdersComponent } from './table-orders/table-orders.component';
import { OrderHistoryComponent } from './menu/order-history/order-history.component';
import { OfferPageComponent } from './offer/offer-page/offer-page.component';
import { FeedbackPageComponent } from './feedback/feedback-page/feedback-page.component';

const routes: Routes = [
  {path:'dashboard', component:SidebarComponent,children:[
    {path:'menu/order',component:OrderComponent},
    {path:'menu/product',component:ProductComponent},
    {path:'menu/ongoing',component:OngoingComponent},
    {path:'menu/productAnalytics',component:ProductAnalyticsComponent},
    {path:'menu/tableOrder',component:TableOrdersComponent},
    {path:'menu/OrderHistory',component:OrderHistoryComponent},
    {path:'menu/offer',component:OfferPageComponent},
    {path:'menu/Feedback',component:FeedbackPageComponent},

  ],canActivate:[authGuard]},
  {path:'',component:LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
