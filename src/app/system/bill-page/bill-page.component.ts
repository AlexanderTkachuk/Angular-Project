import { Component, OnInit, OnDestroy } from '@angular/core';
import {  pipe, Subscription, forkJoin } from 'rxjs';
import { combineLatest } from 'rxjs/operators';

import { BillService } from '../shared/services/bill.service';
import { Bill } from '../shared/models/bill.model';


@Component({
  selector: 'wfm-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit {
 
  constructor(private billService: BillService) { }
  currency: any ;
  bill: Bill;
  isLoaded = false;

  ngOnInit() {
          forkJoin(
            this.billService.getBill(),
            this.billService.getCurrency()
          )
          .subscribe((data )=>{
            this.bill = data[0];
            this.currency = data[1];
            this.isLoaded = true;
          })
    }
  
  onRefresh() {
    this.isLoaded = false;
    this.billService.getCurrency()
    .subscribe((curr: any) => {
      this.currency = curr;
      this.isLoaded = true;
    })
  }

}
