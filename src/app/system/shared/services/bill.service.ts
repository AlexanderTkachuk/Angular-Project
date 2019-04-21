import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';
import { BaseApi } from '../../../shared/core/base-api';

@Injectable()

export class BillService extends BaseApi {
    
    constructor(
        public http: HttpClient
    ) {
        super(http);
    }

    getBill(): Observable<Bill> {
        return this.get('bill');
    }

    
    updateBill(bill: Bill) : Observable<Bill> {
        return this.put('bill', bill);
    }

    getCurrency(): Observable<any> {
        return this.http.get(
            `http://data.fixer.io/api/latest?access_key=7d6c0efa335f6ebd3ffca0a9de75d4fb&symbols`
        );
    }

}