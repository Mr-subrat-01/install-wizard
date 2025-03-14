import { Component } from '@angular/core';
import { WorkflowWizardComponent } from "./workflow-wizard/workflow-wizard.component";
import { WorkflowDiagramComponent } from "./workflow-diagram/workflow-diagram.component";
import { WorkflowDiagram1Component } from "./workflow-diagram-1/workflow-diagram-1.component";
import { WorkflowFormComponent } from "./workflow-form/workflow-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkflowWizardComponent, WorkflowDiagramComponent, WorkflowDiagram1Component, WorkflowFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'insatll-wizard';
}
