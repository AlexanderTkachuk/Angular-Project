import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wfm-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})
export class CurrencyCardComponent implements OnInit {

  @Input() currency: any;
  currencies: string[] = ['USD', 'EUR'];
  date: string;
  constructor() { }

  ngOnInit() {
    this.date = this.currency.date;
  }

}
