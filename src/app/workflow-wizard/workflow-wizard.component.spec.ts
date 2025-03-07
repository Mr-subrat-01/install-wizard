import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowWizardComponent } from './workflow-wizard.component';

describe('WorkflowWizardComponent', () => {
  let component: WorkflowWizardComponent;
  let fixture: ComponentFixture<WorkflowWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
