import { Component, OnInit } from '@angular/core';
import { BillService } from '../shared/services/bill.service';
import { EventService } from '../shared/services/event.service';
import { CategoriesService } from '../shared/services/categories.service';
import { forkJoin } from 'rxjs';
import { Bill } from '../shared/models/bill.model';
import { Category } from '../shared/models/category.model';
import { WFMEvent } from '../shared/models/event.model';

@Component({
  selector: 'wfm-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit {

  isLoaded = false;
  bill: Bill;
  categories: Category[] = [];
  events: any;

  constructor(private billService: BillService, 
              private eventService: EventService,
              private categoryService: CategoriesService) { }

  ngOnInit() {
    forkJoin(
      this.billService.getBill(),
      this.categoryService.getCategories(),
      this.eventService.getEvents()
    ).subscribe((data: [Bill, Category[], WFMEvent]) => {
      this.bill = data[0];
      this.categories = data[1];
      this.events = data[2];

      this.isLoaded = true;
    })
  }

  getCategoryCoast(cat: Category) : number {
    const categoEvents = this.events
              .filter(e => e.category === cat.id &&
                 e.type === 'outcome');
    
    return categoEvents.reduce((total, e) => {
      total += e.amount;
      return total;
    }, 0);
  }

  private getPercent(cat: Category) : number{
    const percent = ((100 * this.getCategoryCoast(cat)) /cat.capacity);
    return percent > 100 ? 100: percent;
  }

  getCatPercent(cat: Category) : string {
    return this.getPercent(cat) + '%';
  }

  getCatColorClass(cat: Category) : string {
    const percent = this.getPercent(cat);
    return  percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';
  }
}
