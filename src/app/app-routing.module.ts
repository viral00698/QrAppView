import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { Test1Component } from './test1/test1.component';
import { OrderComponent } from './menu/order/order.component';
import { ProductComponent } from './menu/product/product.component';
import { OngoingComponent } from './menu/ongoing/ongoing.component';

const routes: Routes = [
  {path:'test',component:TestComponent},
  {path:'test1',component:Test1Component},
  {path:'menu/order',component:OrderComponent},
  {path:'menu/product',component:ProductComponent},
  {path:'menu/ongoing',component:OngoingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
