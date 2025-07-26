import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './menu/order/order.component';
import { ProductComponent } from './menu/product/product.component';
import { OngoingComponent } from './menu/ongoing/ongoing.component';
import { ProductAnalyticsComponent } from './menu/product-analytics/product-analytics.component';
import { LoginComponent } from './login/login/login.component';
import { authGuard } from './gard/auth.guard';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TableOrdersComponent } from './table-orders/table-orders.component';
import { OrderHistoryComponent } from './menu/order-history/order-history.component';
import { OfferPageComponent } from './offer/offer-page/offer-page.component';
import { FeedbackPageComponent } from './feedback/feedback-page/feedback-page.component';
import { CreateVendorComponent } from './admin/create-vendor/create-vendor.component';
import { ViewVendorsComponent } from './admin/view-vendors/view-vendors.component';
import { EmployeeComponent } from './vendor/employee/employee.component';
import { roleWiseGuard } from './auth/role-wise.guard';
import { KitchenComponent } from './kds/kitchen/kitchen.component';
import { InvalidAccessComponent } from './error/invalid-access/invalid-access.component';

const routes: Routes = [
  {path:'dashboard', component:SidebarComponent,children:[

    {path:'menu/order',component:OrderComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER','MANAGER'] } },
    {path:'menu/product',component:ProductComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER','MANAGER'] }},
    {path:'menu/ongoing',component:OngoingComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER','MANAGER'] }},
    {path:'menu/productAnalytics',component:ProductAnalyticsComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER'] }},
    {path:'menu/tableOrder',component:TableOrdersComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER','MANAGER'] }},
    {path:'menu/OrderHistory',component:OrderHistoryComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER','MANAGER'] }},
    {path:'menu/offer',component:OfferPageComponent, canActivate:[roleWiseGuard], data: { roles: ['VENDER','MANAGER'] }},
    {path:'menu/Feedback',component:FeedbackPageComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER','MANAGER'] }},
    {path:'admin/createVendor',component:CreateVendorComponent ,canActivate:[roleWiseGuard], data: { roles: ['ADMIN'] }},
    {path:'admin/vendors' , component:ViewVendorsComponent , canActivate:[roleWiseGuard], data: { roles: ['ADMIN'] }},
    {path:'vendor/employee' , component:EmployeeComponent , canActivate:[roleWiseGuard], data: { roles: ['VENDER'] }},
    {path:'cook/kitchen' , component:KitchenComponent ,canActivate:[roleWiseGuard], data: { roles: ['VENDER','COOK'] }}

  ],canActivate:[authGuard]},
  {path:'',component:LoginComponent},
  {path:'unauthorized', component:InvalidAccessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
