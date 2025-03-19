import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private items: Item[] = [
    { id: 1, name: 'Item 1', description: 'Description for Item 1' },
    { id: 2, name: 'Item 2', description: 'Description for Item 2' }
  ];

  private itemsSubject = new BehaviorSubject<Item[]>(this.items);

  constructor() { }

  // Get all items
  getItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  // Get a single item by id
  getItem(id: number): Observable<Item | undefined> {
    const item = this.items.find(i => i.id === id);
    return of(item);
  }

  // Create a new item
  addItem(item: Omit<Item, 'id'>): Observable<Item> {
    const newId = this.items.length > 0 ? Math.max(...this.items.map(i => i.id)) + 1 : 1;
    const newItem = { id: newId, ...item };
    this.items = [...this.items, newItem];
    this.itemsSubject.next(this.items);
    return of(newItem);
  }

  // Update an existing item
  updateItem(updatedItem: Item): Observable<Item | undefined> {
    this.items = this.items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.itemsSubject.next(this.items);
    return of(updatedItem);
  }

  // Delete an item
  deleteItem(id: number): Observable<boolean> {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    this.itemsSubject.next(this.items);
    return of(initialLength > this.items.length);
  }
}
