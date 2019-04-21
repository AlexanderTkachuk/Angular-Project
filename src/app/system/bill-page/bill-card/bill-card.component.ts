import { Component, OnInit, Input } from '@angular/core';
import { Bill } from '../../shared/models/bill.model';

@Component({
  selector: 'wfm-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {

  @Input() bill: Bill;  
  @Input() currency: any;
  rub: number;
  dollar: number;
  euro: number;

  constructor() { }

  ngOnInit() {
    const {rates} = this.currency;
    this.rub = rates['RUB'] * this.bill.value;
    this.dollar = rates['USD'] * this.bill.value ;
    this.euro = rates['EUR'] * this.bill.value;

  }

  


}
