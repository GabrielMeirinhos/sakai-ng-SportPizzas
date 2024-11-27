import { Component, OnInit } from '@angular/core';
import { Pizza } from 'src/app/demo/api/pizza.model';  // Changed to Pizza model
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PizzaService } from 'src/app/demo/service/pizza.service';  // Changed to PizzaService

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    pizzaDialog: boolean = false;  // Changed variable name to pizzaDialog

    deletePizzaDialog: boolean = false;  // Changed to deletePizzaDialog

    deletePizzasDialog: boolean = false;  // Changed to deletePizzasDialog

    pizzas: Pizza[] = [];  // Changed to pizzas array

    pizza: Pizza = {};  // Changed to pizza

    selectedPizzas: Pizza[] = [];  // Changed to selectedPizzas

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private pizzaService: PizzaService, private messageService: MessageService) { }  // Changed to PizzaService

    ngOnInit() {
        this.pizzaService.getPizzas().subscribe(data => this.pizzas = data);  // Changed to pizzaService

        this.cols = [
            { field: 'name', header: 'Pizza' },  // Changed field to name for pizza
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

    }

    openNew() {
        console.log('openNew')
        this.pizza = {};  // Changed to pizza
        this.submitted = false;
        this.pizzaDialog = true;  // Changed to pizzaDialog
    }

    deleteSelectedPizzas() {
        this.deletePizzaDialog = true;  // Changed to deletePizzasDialog
    }

    editPizza(pizza: Pizza) {  // Changed to editPizza
        this.pizza = { ...pizza };  // Changed to pizza
        this.pizzaDialog = true;  // Changed to pizzaDialog
    }

    deletePizza(pizza: Pizza) {  // Changed to deletePizza
        this.deletePizzaDialog = true;  // Changed to deletePizzaDialog
        this.pizza = { ...pizza };  // Changed to pizza
    }

    confirmDeleteSelected() {
        
        this.deletePizzaDialog = false;  // Changed to deletePizzasDialog
        this.pizzas = this.pizzas.filter(val => !this.selectedPizzas.includes(val));  // Changed to selectedPizzas and pizzas
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizzas Deleted', life: 3000 });  // Changed message to Pizzas
        this.selectedPizzas = [];  // Changed to selectedPizzas
    }

    confirmDelete() {
        this.deletePizzaDialog = false;  // Changed to deletePizzaDialog
        // this.pizzas = this.pizzas.filter(val => val.id !== this.pizza.id);  // Changed to pizza and pizzas
        this.pizzaService.deletePizza(this.pizza.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizza Deleted', life: 3000 });  // Changed message to Pizza
        this.pizza = {};  // Changed to pizza
    }

    hideDialog() {
        this.pizzaDialog = false;  // Changed to pizzaDialog
        this.submitted = false;
    }

    savePizza() {  // Changed to savePizza
        this.submitted = true;
        console.log('SavePizza')
        if (this.pizza.name?.trim()) {  // Changed to pizza
            if (this.pizza.id) {  // Changed to pizza
                // @ts-ignore
                this.pizza.inventoryStatus = this.pizza.inventoryStatus.value ? this.pizza.inventoryStatus.value : this.pizza.inventoryStatus;  // Changed to pizza
                this.pizzaService.updatePizza(this.pizza.id, this.pizza)
                this.pizzas[this.findIndexById(this.pizza.id)] = this.pizza;  // Changed to pizza and pizzas
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizza Updated', life: 3000 });  // Changed message to Pizza
            } else {
                this.pizzaService.createPizza(this.pizza)
                // @ts-ignore
                this.pizza.inventoryStatus = this.pizza.inventoryStatus ? this.pizza.inventoryStatus.value : 'INSTOCK';  // Changed to pizza
                this.pizzas.push(this.pizza);  // Changed to pizzas
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizza Created', life: 3000 });
                console.log(this.messageService.messageObserver) // Changed message to Pizza
            }

            this.pizzas = [...this.pizzas];  // Changed to pizzas
            this.pizzaDialog = false;  // Changed to pizzaDialog
            this.pizza = {};  // Changed to pizza
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.pizzas.length; i++) {  // Changed to pizzas
            if (this.pizzas[i].id === id) {  // Changed to pizzas and pizza
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
