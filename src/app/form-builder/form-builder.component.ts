import { CommonModule, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    FormsModule,
    NgFor,
    TitleCasePipe,
    NgSelectModule,
  ],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.css',
})
export class FormBuilderComponent {
  @Input() isOpen: boolean = false; // Control modal from Parent
  @Output() closeModal = new EventEmitter<void>(); // Notify Parent to close
  @Output() formJsonGenerated = new EventEmitter<any>(); // Emit JSON
  @Input() taskIndex: number | undefined;
  formFields: any[] = [];
  selectedType: string = '';
  formTypes = ['text', 'checkbox', 'radio', 'file', 'select', 'textarea'];
  generatedJson: any = {};
  allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc'];
  dataTypes = [
    { label: 'Number', value: 'number' },
    { label: 'Text', value: 'text' },
    { label: 'Decimal', value: 'decimal' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Date', value: 'date' },
    { label: 'Timestamp', value: 'timestamp' },
    { label: 'JSON', value: 'json' },
    { label: 'Email', value: 'email' },
  ];
  addField(type: string) {
    let newField: any = {
      name: '',
      label: '',
      is_required: false,
      type: type,
      options: [],
      extensions: [],
      data_type: '',
    };

    if (type === 'file') {
      newField.extensions = [];
    }

    if (type === 'radio' || type === 'checkbox' || type === 'select') {
      newField.options = [''];
    }

    this.formFields.push(newField);
  }

  addOption(field: any) {
    field.options.push('');
  }

  removeOption(field: any, index: number) {
    field.options.splice(index, 1);
  }

  generateJson() {
    this.generatedJson = {
      taskIndex: this.taskIndex,
      formFields: {},
    };

    this.formFields.forEach((field) => {
      const field_lower = field.label.toLowerCase().replace(/\s+/g, '_');
      this.generatedJson.formFields[field_lower] = {
        name: field_lower,
        label: field.label,
        is_required: field.is_required ? 'required' : '',
        extensions: field.extensions,
        options: field.options,
        type: field.type,
        data_type: field.data_type,
      };
    });

    this.formJsonGenerated.emit(this.generatedJson);
  }

  removeField(index: number) {
    this.formFields.splice(index, 1);
  }
}
