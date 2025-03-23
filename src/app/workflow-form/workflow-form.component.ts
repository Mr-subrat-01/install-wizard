import { NgFor } from '@angular/common';
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
import { FormBuilderComponent } from '../form-builder/form-builder.component';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'app-workflow-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgSelectModule,
    FormBuilderComponent,
    FormsModule
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
  workflowId: any;
  formTaskIndex: number | undefined;
  ruleTaskIndex: number | undefined;
  userList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Alice Johnson' },
  ];
  message: string = '';
  isOpen: boolean = false;
  conditions: any[] = [];
  isFormModalOpen = false;
  formJson: {
    taskIndex: number | undefined;
    formFields: Record<
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
    >;
  } = {
    taskIndex: undefined,
    formFields: {},
  };

  fields: any = [];
  rules: any[] = [];
  ruleName: string = '';
  ruleDescription: string = '';
  isloading = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private workflowService: WorkflowService
  ) {
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

  updateWorkflow() {
    if (this.workflowForm.get('workflow')?.valid) {
      if (this.workflowId) {
        this.isloading = true;
        const workflowData = this.workflowForm.get('workflow')?.value;
        this.workflowService
          .updateWorkflow(this.workflowId, workflowData)
          .subscribe({
            next: (response) => {
              this.message = 'Workflow updated successfully';
              this.isOpen = true;
            },
            error: (error) => {
              console.error('Error updating workflow:', error);
            },
            complete: () => {
              this.isloading = false;
            },
          });
      }
    }
  }
  saveWorkflow() {
    if (this.workflowForm.get('workflow')?.valid) {
      if (!this.workflowId) {
        this.isloading = true;
        const workflowData = this.workflowForm.get('workflow')?.value;
        this.workflowService.insertWorkflow(workflowData).subscribe({
          next: (response) => {
            this.message = 'Workflow inserted successfully';
            this.isOpen = true;
            this.workflowId = response.workflow.id;
          },
          error: (error) => {
            this.isloading = false;
            console.error('Error inserting workflow:', error);
          },
          complete: () => {
            this.isloading = false;
          },
        });
      }
    }
  }

  addStage() {
    if (!this.workflowId) {
      alert('First Save Workflow DDetails');
      return;
    }
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
      sla: ['', Validators.required],
      user_ids: this.fb.control([]),
      conditions: this.fb.array([]),
      taskRule: this.fb.array([]),
      form: this.fb.array([]),
      logical_operator: [''],
      rule_id: [''],
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

  openFormModal(taskIndex: number) {
    this.isFormModalOpen = true;
    this.formTaskIndex = taskIndex;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
  }

  onJsonGenerated(json: any) {
    this.formJson = json;
    console.log(this.formJson);
    this.fields = Object.keys(this.formJson);
    const tasks = this.getTasks(this.currentIndex);

    if (tasks && tasks.length > 0 && this.formJson.taskIndex != undefined) {
      const task = tasks.at(this.formJson.taskIndex) as FormGroup;
      let formArray = task.get('form') as FormArray;

      if (formArray) {
        formArray.clear();
        formArray.push(new FormControl({ ...this.formJson.formFields }));
      }
    }
    this.closeFormModal();
  }
  closeRuleDialog() {
    this.isRuleDialogOpen = false;
  }

  openRuleDialog(taskIndex: number) {
    this.isRuleDialogOpen = true;
    this.ruleTaskIndex = taskIndex;
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  addRule() {
    if (!this.ruleName.trim() || !this.ruleDescription.trim()) {
      alert('Please enter Rule Name and Description.');
      return;
    }
    this.isloading = true;
    this.workflowService
      .insertRule(this.ruleName, this.ruleDescription)
      .subscribe({
        next: (res) => {
          this.isloading = false;
          console.log(res);
          if (this.ruleTaskIndex != undefined) {
            this.addRuleToTask(
              this.currentIndex,
              this.ruleTaskIndex,
              res.rule.id,
              res.rule.name,
              res.rule.description
            );
          }
          this.message = 'Rule Saved';
          this.isOpen = true;
        },
        error: (err) => {
          this.isloading = false;
          console.log(err);
        },
      });

    this.ruleName = '';
    this.ruleDescription = '';

    this.isRuleDialogOpen = false;
  }
  operators = ['=', '!=', '>', '<', '>=', '<='];

  addCondition(stageIndex: number, taskIndex: number, rule_id: number) {
    const condition = this.fb.group({
      field: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
      inputType: ['text'],
      rule_id: [rule_id],
    });

    this.getConditions(stageIndex, taskIndex).push(condition);
    this.updateLogicalOperatorValidation(stageIndex, taskIndex); // Update validation
  }

  onFieldChange(
    event: Event,
    stageIndex: number,
    taskIndex: number,
    condIndex: number
  ) {
    const selectedFieldName = (event.target as HTMLSelectElement).value;
    const selectedField = this.formJson.formFields[selectedFieldName];
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
    this.updateLogicalOperatorValidation(stageIndex, taskIndex); // Update validation
  }
  closeDialog() {
    this.isOpen = !this.isOpen;
  }
  saveStagesWithTasks() {
    const stagesArray = this.stages;

    if (stagesArray.length === 0) {
      alert('At least one stage is required.');
      return;
    }

    if (this.currentIndex < 0 || this.currentIndex >= stagesArray.length) {
      alert('Invalid stage index.');
      return;
    }

    const stage = stagesArray.at(this.currentIndex) as FormGroup;
    let errors: string[] = [];

    if (!stage.valid) {
      errors.push(`Stage ${this.currentIndex + 1} has invalid data.`);
    }

    const tasksArray = stage.get('tasks') as FormArray;
    if (tasksArray.length === 0) {
      errors.push(
        `Stage ${this.currentIndex + 1} must have at least one task.`
      );
    } else {
      for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
        const task = tasksArray.at(taskIndex) as FormGroup;
        if (!task.valid) {
          errors.push(
            `Task ${taskIndex + 1} in Stage ${
              this.currentIndex + 1
            } has invalid data.`
          );
        }
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n')); // Show all validation errors at once
      return;
    }

    // Log the current stage with all tasks in JSON format
    const stageData = stage.getRawValue(); // getRawValue() retrieves the full value including disabled fields
    console.log('Validated Stage Data:', JSON.stringify(stageData, null, 2));
    const formattedData = {
      stages: stageData,
    };
    this.isloading = true;
    this.workflowService
      .insertStageWithTask(formattedData, this.workflowId)
      .subscribe({
        next: (res) => {
          this.message = 'Stage and Task Inserted';
          this.isOpen = true;
          this.isloading = false;
          console.log(res);
        },
        error: (err) => {
          this.isloading = false;
          console.log(err);
        },
      });
  }

  addRuleToTask(
    stageIndex: number,
    taskIndex: number,
    ruleId: number,
    ruleName: string,
    ruleDescription: string
  ) {
    const tasks = this.getTasks(stageIndex);

    if (tasks && tasks.length > taskIndex) {
      const task = tasks.at(taskIndex) as FormGroup;
      let taskRules = task.get('taskRule') as FormArray;
      if (task.get('rule_id')) {
        task.get('rule_id')?.patchValue(ruleId);
      } else {
        task.addControl('rule_id', new FormControl(ruleId));
      }
      if (taskRules) {
        taskRules.push(
          new FormControl({
            id: ruleId,
            name: ruleName,
            description: ruleDescription,
          })
        );
      }
    }
  }

  updateLogicalOperatorValidation(stageIndex: number, taskIndex: number) {
    const conditionsArray = this.getConditions(stageIndex, taskIndex);
    const taskGroup = this.getTasks(stageIndex).at(taskIndex);

    if (!taskGroup) return; // Ensure taskGroup exists

    const logicalOperatorControl = taskGroup.get('logical_operator');

    if (logicalOperatorControl) {
      // Check if control exists
      if (conditionsArray.length > 1) {
        logicalOperatorControl.setValidators(Validators.required);
      } else {
        logicalOperatorControl.clearValidators();
        logicalOperatorControl.setValue(''); // Reset when only one condition exists
      }

      logicalOperatorControl.updateValueAndValidity();
    }
  }
}
