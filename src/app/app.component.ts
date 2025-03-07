import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkflowWizardComponent } from "./workflow-wizard/workflow-wizard.component";
import { ExampleComponent } from "./example/example.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorkflowWizardComponent, ExampleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'insatll-wizard';
}
