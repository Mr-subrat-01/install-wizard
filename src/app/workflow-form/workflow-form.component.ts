import { NgFor } from '@angular/common';
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
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-workflow-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgSelectModule],
  templateUrl: './workflow-form.component.html',
  styleUrl: './workflow-form.component.css',
})
export class WorkflowFormComponent {
  workflowForm: FormGroup;
  step = 0;
  wantToDelete = false;
  currentIndex: number = 0;
  userList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Alice Johnson' },
  ];
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

  get stages() {
    return this.workflowForm.get('stages') as FormArray;
  }

  addStage() {
    if (this.stages.controls.length == 0) {
      this.step = 1;
      this.currentIndex = 0;
    }
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
    this.currentIndex = index;
    this.wantToDelete = true;
  }
  closeDeleteDialog() {
    this.wantToDelete = false;
    this.currentIndex = 0;
  }
  removeCurrentStage() {
    if (this.currentIndex !== undefined) {
      this.stages.removeAt(this.currentIndex);
    }
    this.wantToDelete = false;
  }
  editOrAddStage(index: number) {
    this.step = 1;
    this.currentIndex = index;
  }
  getStageFormGroup(index: number): FormGroup {
    return this.stages.at(index) as FormGroup;
  }
  getTaskFormGroup(stageIndex: number, taskIndex: number): FormGroup {
    return this.getTasks(stageIndex).at(taskIndex) as FormGroup;
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

  getUserIds(stageIndex: number, taskIndex: number): FormControl {
    return this.getTaskFormGroup(stageIndex, taskIndex).get(
      'user_ids'
    ) as FormControl;
  }
}
