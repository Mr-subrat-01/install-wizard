import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDiagramComponent } from './workflow-diagram.component';

describe('WorkflowDiagramComponent', () => {
  let component: WorkflowDiagramComponent;
  let fixture: ComponentFixture<WorkflowDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
