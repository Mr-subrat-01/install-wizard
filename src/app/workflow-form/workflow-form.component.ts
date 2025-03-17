import { KeyValuePipe, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilderComponent } from "../form-builder/form-builder.component";

@Component({
  selector: 'app-workflow-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgSelectModule,
    FormBuilderComponent,
    FormsModule,
    KeyValuePipe,
  ],
  templateUrl: './workflow-form.component.html',
  styleUrl: './workflow-form.component.css',
})
export class WorkflowFormComponent {
  workflowForm: FormGroup;
  step = 0;
  isRuleDialogOpen = false;
  wantToDelete = false;
  currentIndex: number = 0;
  userList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Alice Johnson' },
  ];
  conditions: any[] = [];
  isFormModalOpen = false;
  formJson: Record<
    string,
    {
      name: string;
      label: string;
      is_required: string;
      options: any[];
      extensions: any[];
      type: string;
      data_type: string;
    }
  > = {};
  fields: any = [];
  rules: any[] = [];
  ruleName: string = '';
  ruleDescription: string = '';

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

  getConditions(stageIndex: number, taskIndex: number): FormArray {
    return this.getTaskFormGroup(stageIndex, taskIndex).get(
      'conditions'
    ) as FormArray;
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
      conditions: this.fb.array([]),
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

  openFormModal() {
    this.isFormModalOpen = true;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
  }

  onJsonGenerated(json: any) {
    this.formJson = json;
    console.log(this.formJson);
    this.fields = Object.keys(this.formJson);
    this.closeFormModal();
  }
  closeRuleDialog() {
    this.isRuleDialogOpen = false;
  }

  openRuleDialog() {
    this.isRuleDialogOpen = true;
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  addRule() {
    if (!this.ruleName.trim() || !this.ruleDescription.trim()) {
      alert('Please enter Rule Name and Description.');
      return;
    }

    const newRule = {
      id: Math.floor(1000 + Math.random() * 9000),
      name: this.ruleName,
      description: this.ruleDescription,
    };

    this.rules.push(newRule);

    this.ruleName = '';
    this.ruleDescription = '';

    console.log('Rules:', this.rules);
    this.isRuleDialogOpen = false;
  }
  operators = ['=', '!=', '>', '<', '>=', '<='];

  addCondition(stageIndex: number, taskIndex: number) {
    const condition = this.fb.group({
      field: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
      inputType: ['text'],
    });

    this.getConditions(stageIndex, taskIndex).push(condition);
  }

  onFieldChange(
    event: Event,
    stageIndex: number,
    taskIndex: number,
    condIndex: number
  ) {
    const selectedFieldName = (event.target as HTMLSelectElement).value;
    const selectedField = this.formJson[selectedFieldName];
    console.log(selectedField);
    if (selectedField) {
      const condition = this.getConditions(stageIndex, taskIndex).at(condIndex);
      condition.patchValue({
        inputType: this.getInputType(selectedField.data_type),
      });
    }
  }

  getInputType(dataType: string): string {
    switch (dataType) {
      case 'number':
      case 'decimal':
        return 'number';
      case 'boolean':
        return 'checkbox';
      case 'date':
        return 'date';
      case 'timestamp':
        return 'datetime-local';
      case 'email':
        return 'email';
      case 'json':
        return 'text';
      default:
        return 'text';
    }
  }

  // Remove a condition
  removeCondition(stageIndex: number, taskIndex: number, condIndex: number) {
    this.getConditions(stageIndex, taskIndex).removeAt(condIndex);
  }
}
