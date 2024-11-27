import { Injectable } from '@angular/core';
import { Pizza } from '../api/pizza.model';
import { map } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Injectable()
export class PizzaService {
    private basePath = "pizzas"
    constructor(
        private db: AngularFireDatabase,
    ) { }

    // Create a new pizza
    createPizza(pizza: Pizza): any {
        console.log('SALVANDO PIZZA')
        return this.db.list<Pizza>(this.basePath).push(pizza);
    }
    // Retrieve all products
    getPizzas() {
        return this.db.list<Pizza>(this.basePath).snapshotChanges().pipe(
            map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
        );
    }

    // Retrieve a pizza by ID
    getPizzaById(id: string) {
        return this.db.object<Pizza>(`${this.basePath}/${id}`).snapshotChanges().pipe(
            map(c => ({ key: c.payload.key, ...c.payload.val() }))
        );
    }

    // Update an existing pizza
    updatePizza(id: string, pizza: Pizza): Promise<void> {
        return this.db.object<Pizza>(`${this.basePath}/${id}`).update(pizza);
    }

    // Delete a pizza by ID
    deletePizza(id: string): Promise<void> {
        return this.db.object(`${this.basePath}/${id}`).remove();
    }
}
