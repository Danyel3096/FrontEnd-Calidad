import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor() { }

    private suppliers : Products[] = [
        { id : 1, name : 'Product A', description : 'Lorem ipsum 1'},
        { id : 2, name : 'Product B', description : 'Lorem ipsum 2'},
        { id : 3, name : 'Product C', description : 'Lorem ipsum 3'},
        { id : 4, name : 'Product D', description : 'Lorem ipsum 4'}
    ]

    getProductsList(): Observable<Products[]> {
        return of(this.suppliers);
    }
}

export interface Products{
    id: number;
    name : string;
    description : string;
}