import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private basePath = 'products'

    constructor(private db: AngularFireDatabase) {}

    getProducts(): Observable<Product[]>{
        return this.db.list<Product>(this.basePath).snapshotChanges().pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val() })))
        )
    }
    getProduct(key: string) {
        return this.db.list<Product>(`${this.basePath}/${key}`).snapshotChanges().pipe(
            map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val() }))))
            }
    
    createProduct(product: Product){
        return this.db.list<Product>(this.basePath).push(product);
    }

    updateProduct(key: string, value: any){
        return this.db.object<Product>(`${this.basePath}/${key}`).update(value);
    }

    deleteProduct(key: string){
        return this.db.object<Product>(`${this.basePath}/${key}`).remove();
    }
}

