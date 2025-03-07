import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgSelectModule,
} from '@ng-select/ng-select';

@Component({
  selector: 'app-workflow-wizard',
  standalone: true,
  imports: [NgIf, JsonPipe, NgFor, ReactiveFormsModule, NgSelectModule],
  templateUrl: './workflow-wizard.component.html',
  styleUrls: ['./workflow-wizard.component.css'],
})
export class WorkflowWizardComponent {
  workflowForm: FormGroup;
  step = 0;
  apiUrl = 'http://127.0.0.1:8000/api/v1/';
  message: string = 'Workflow created successfully';
  isOpen: boolean = false;
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.workflowForm = this.fb.group({
      workflow: this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['', [Validators.required, Validators.maxLength(255)]],
        sla: ['', Validators.required],
      }),
      stages: this.fb.array([]),
    });
  }

  get stages() {
    return this.workflowForm.get('stages') as FormArray;
  }

  getStageFormGroup(index: number): FormGroup {
    return this.stages.at(index) as FormGroup;
  }

  getTaskFormGroup(stageIndex: number, taskIndex: number): FormGroup {
    return this.getTasks(stageIndex).at(taskIndex) as FormGroup;
  }

  addStage() {
    const stage = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      auto_progress: [false, Validators.required],
      order_index: [
        this.stages.length + 1,
        [Validators.required, Validators.min(1)],
      ],
      condition_expression: [
        '',
        Validators.pattern(/^[a-zA-Z0-9_ \-<>=!()&|]+$/),
      ],
      sla: ['', Validators.required],
      tasks: this.fb.array([]),
    });
    this.stages.push(stage);
  }

  removeStage(index: number) {
    this.stages.removeAt(index);
  }

  getTasks(stageIndex: number): FormArray {
    return this.getStageFormGroup(stageIndex).get('tasks') as FormArray;
  }

  addTask(stageIndex: number) {
    const task = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      ai_model_id: [''],
      auto_execute: [false, Validators.required],
      order_index: [
        this.getTasks(stageIndex).length + 1,
        [Validators.required, Validators.min(1)],
      ],
      condition_expression: [
        '',
        Validators.pattern(/^[a-zA-Z0-9_ \-<>=!()&|]+$/),
      ],
      sla: ['', Validators.required],
      user_ids: this.fb.control([]),
    });

    this.getTasks(stageIndex).push(task);
  }

  removeTask(stageIndex: number, taskIndex: number) {
    if (taskIndex >= 0 && taskIndex < this.getTasks(stageIndex).length) {
      this.getTasks(stageIndex).removeAt(taskIndex);
    }
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 0) {
      this.step--;
    }
  }

  getUserIds(stageIndex: number, taskIndex: number): FormControl {
    return this.getTaskFormGroup(stageIndex, taskIndex).get(
      'user_ids'
    ) as FormControl;
  }

  userList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Alice Johnson' },
  ];

  submit() {
    if (this.workflowForm.valid) {
      console.log(
        'Final JSON:',
        JSON.stringify(this.workflowForm.value, null, 2)
      );
      const formData = this.workflowForm.value;

      const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2xvZ2luIiwiaWF0IjoxNzQxMjc4MjI0LCJleHAiOjE3NDEyODE4MjQsIm5iZiI6MTc0MTI3ODIyNCwianRpIjoicElnNXVmc0pVek5zc0hTMCIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.zSEAO91PmTvQv8JDGUKIR6VJZ6F1B72nMV3VFgi7E2Q';

      this.http
        .post(`${this.apiUrl}workflow/wizard/1`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .subscribe({
          next: (response:any) => {
            console.log(response);
            this.message = response.message;
            this.isOpen = true;
            this.resetForm();
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  resetForm() {
    this.workflowForm.reset();
    this.step = 0;

    this.workflowForm = this.fb.group({
      workflow: this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['', [Validators.required, Validators.maxLength(255)]],
        sla: ['', Validators.required],
      }),
      stages: this.fb.array([]),
    });
  }
  closeDialog() {
    this.isOpen = !this.isOpen;
  }
}
