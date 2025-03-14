import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDiagram1Component } from './workflow-diagram-1.component';

describe('WorkflowDiagram1Component', () => {
  let component: WorkflowDiagram1Component;
  let fixture: ComponentFixture<WorkflowDiagram1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowDiagram1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowDiagram1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
