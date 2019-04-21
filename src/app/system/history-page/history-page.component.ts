import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

import { EventService } from '../shared/services/event.service';
import { Category } from '../shared/models/category.model';
import { WFMEvent } from '../shared/models/event.model';

@Component({
  selector: 'wfm-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit {

  constructor(private categoryService: CategoriesService,
    private eventService: EventService) { }
  
    isLoaded = false;
    isFilterVisible = false;

    categories: Category[] = [];
    events : any;
    filteredEvents: any = []; // копия массива events
    chartData = [];

    calculateChartData(): void {
      this.chartData = [];
  
      this.categories.forEach((cat) => {
        const catEvent = this.filteredEvents.filter((e) => e.category === cat.id 
        && e.type === 'outcome');
        this.chartData.push({
          name: cat.name,
          value: catEvent.reduce((total, e) => {
            total += e.amount;
            return total;
          },0)
        })
  
      })
    }


  ngOnInit() {
    forkJoin(
      this.categoryService.getCategories(),
      this.eventService.getEvents()
    ).subscribe((data: [Category[], WFMEvent]) => {
      this.categories = data[0];
      this.events = data[1];

      this.setOriginalEvents();
      this.calculateChartData();

      this.isLoaded = true;
    });

  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  onFilterApply(filterData) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    console.log(filterData);


    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');


    this.filteredEvents = this.filteredEvents
    .filter((e) => {
      return filterData.types.indexOf(e.type) !== -1;
    })
    .filter((e) => {
      return filterData.categories.indexOf(e.category.toString()) !== -1;
    })
    .filter((e) => {
      const momentDate  = moment(e.date, 'DD.MM.YYYY HH.mm.ss');
      return momentDate.isBetween(startPeriod, endPeriod);
    });

    this.calculateChartData();

  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

}
