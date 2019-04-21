import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { WFMEvent } from '../../shared/models/event.model';
import { EventService } from '../../shared/services/event.service';
import { BillService } from '../../shared/services/bill.service';
import { Bill } from '../../shared/models/bill.model';
import { mergeMap } from 'rxjs/operators';
import { Message } from '../../../shared/models/message.model';

@Component({
  selector: 'wfm-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  @Input() categories: Category[] = [];
  types = [
    {type: 'income', lable: 'Доход'}, 
    {type: 'outcome', lable: 'Расход'}
  ];
  message: Message;

  constructor(
    private eventsService: EventService,
    private billService: BillService
  ) { }

  ngOnInit() {
    this.message = new Message('danger', '');
  }

  private showMessage(text: string) {
    this.message.text = text;
    window.setTimeout(() => this.message.text = '', 4000);
  }

  onSubmit(form: NgForm) {
    let {amount,description,category,type} = form.value;
    if(amount < 0) amount *= -1;

    const event = new WFMEvent(type,amount,+category,
      moment().format('DD.MM.YYYY HH:MM:SS'),description)

      this.billService.getBill()
        .subscribe((bill: Bill) => {
          let value : number = 0;
          if(type === 'outcome') {
            if(amount > bill.value) {
             this. showMessage(`На счету недостаточно средств. Вам не хватает ${amount - bill.value}`);
             return;
            } else {
              value = bill.value - amount;
            }
          } else {
            value += bill.value + amount;
          }

          this.billService.updateBill({value, currency: bill.currency})
          .pipe(mergeMap(() => this.eventsService.addEvent(event)))
          .subscribe(() => {
              form.setValue({
                amount: 0,
                description: ' ',
                category: 1,
                type: 'outcome'
              })
            })
        })
  };  

}
