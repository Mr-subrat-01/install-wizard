import { Component } from '@angular/core';
import { FormsModule, NgModel, NgSelectOption } from '@angular/forms';
import { NgSelectComponent, NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NgSelectModule, FormsModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})
export class ExampleComponent {
  cities2 = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys', disabled: true },
    { id: 4, name: 'Pabradė' },
    { id: 5, name: 'Klaipėda' },
  ];
  selectedCityIds: string[] | undefined;
}
