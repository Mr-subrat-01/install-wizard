import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import mermaid from 'mermaid';

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  imports: [],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.css',
})
export class WorkflowDiagramComponent implements OnInit, AfterViewInit {
  jsonData = {
    workflow: {
      name: 'Comprehensive Approval Process',
      description: 'A multi-stage workflow for approvals',
      sla: 72,
    },
    stages: [
      {
        name: 'Initial Review',
        description: 'First step in the approval process',
        auto_progress: true,
        order_index: 1,
        sla: 20,
        tasks: [
          {
            name: 'Manager Approval',
            description: 'Manager must approve',
            auto_execute: false,
            order_index: 1,
            sla: 10,
          },
          {
            name: 'HR Validation',
            description: 'HR department checks compliance',
            auto_execute: false,
            order_index: 2,
            sla: 10,
          },
        ],
      },
      {
        name: 'Final Approval',
        description: 'Final step before execution',
        auto_progress: true,
        order_index: 2,
        sla: 28,
        tasks: [
          {
            name: 'CEO Approval',
            description: 'CEO must give the final sign-off',
            auto_execute: false,
            order_index: 1,
            sla: 16,
          },
          {
            name: 'Implementation Notification',
            description: 'Notify the implementation team',
            auto_execute: true,
            order_index: 2,
            sla: 12,
          },
        ],
      },
    ],
  };

  mermaidCode: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.generateMermaidDiagram();
  }
  ngAfterViewInit() {
    mermaid.initialize({ theme: 'default', startOnLoad: true });
    setTimeout(
      () =>
        mermaid.init(
          undefined,
          this.el.nativeElement.querySelectorAll('.mermaid')
        ),
      200
    );
  }
  generateMermaidDiagram() {
    let diagram = `graph LR;\n`; // Left to Right (Horizontal)

    // Start node
    diagram += `A["🚀 Start: ${this.jsonData.workflow.name}"]:::startStyle;\n`;

    let prevStageId = 'A';

    // Loop through stages
    this.jsonData.stages.forEach((stage, stageIndex) => {
      let stageId = `Stage${stageIndex + 1}`;
      diagram += `${prevStageId} ----> ${stageId}["📌 ${stage.name}"]:::stageStyle;\n`;

      let taskIds: string[] = []; // Store task IDs for parallel linking

      // Loop through tasks inside the stage
      stage.tasks.forEach((task) => {
        let taskId = `${stageId}_Task${task.order_index}`;
        diagram += `${stageId} --> ${taskId}["✅ ${task.name}"]:::taskStyle;\n`;
        taskIds.push(taskId);
      });

      // Merge task outputs into a single point to connect to the next stage
      let mergePoint = `Merge_${stageId}`;
      diagram += `${taskIds.join(
        ' & '
      )} --> ${mergePoint}["🔄 Stage Completed"]:::mergeStyle;\n`;

      prevStageId = mergePoint; // Set merge point as previous stage connection
    });

    // Mermaid styling
    diagram += `
      classDef startStyle fill:#ffcc00,stroke:#333,stroke-width:2px;
      classDef stageStyle fill:#0099ff,stroke:#003366,stroke-width:2px,color:white,font-weight:bold;
      classDef taskStyle fill:#66cc66,stroke:#004d00,stroke-width:2px,color:white;
      classDef mergeStyle fill:#ff6600,stroke:#993300,stroke-width:2px,color:white,font-weight:bold;
    `;

    this.mermaidCode = diagram;
  }

  // generateMermaidDiagram() {
  //   let diagram = `graph LR;\n`; // Left to Right (Horizontal)

  //   // Start node
  //   diagram += `A["🚀 Start: ${this.jsonData.workflow.name}"]:::startStyle;\n`;

  //   let prevStageId = 'A';

  //   // Loop through stages
  //   this.jsonData.stages.forEach((stage, stageIndex) => {
  //     let stageId = `Stage${stageIndex + 1}`;
  //     diagram += `${prevStageId} -- "${stage.name}" --> ${stageId}["📌 ${stage.name}"]:::stageStyle;\n`;

  //     let prevTaskId = stageId;

  //     // Loop through tasks inside the stage
  //     stage.tasks.forEach((task) => {
  //       let taskId = `${stageId}_Task${task.order_index}`;
  //       diagram += `${prevTaskId} --> ${taskId}["✅ ${task.name}"]:::taskStyle;\n`;
  //       prevTaskId = taskId;
  //     });

  //     prevStageId = prevTaskId;
  //   });

  //   // Mermaid styling
  //   diagram += `
  //     classDef startStyle fill:#ffcc00,stroke:#333,stroke-width:2px;
  //     classDef stageStyle fill:#0099ff,stroke:#003366,stroke-width:2px,color:white,font-weight:bold;
  //     classDef taskStyle fill:#66cc66,stroke:#004d00,stroke-width:2px,color:white;
  //   `;

  //   this.mermaidCode = diagram;
  // }

  // generateMermaidDiagram() {
  //   let diagram = `graph LR;\n`; // Left to Right (Horizontal)

  //   // Start node
  //   diagram += `A["🚀 Start: ${this.jsonData.workflow.name}"]:::startStyle;\n`;

  //   let prevStageId = 'A';

  //   // Loop through stages
  //   this.jsonData.stages.forEach((stage, stageIndex) => {
  //     let stageId = `Stage${stageIndex + 1}`;
  //     diagram += `${prevStageId} -- "${stage.name}" --> ${stageId}["📌 ${stage.name}"]:::stageStyle;\n`;

  //     let prevTaskId = stageId;

  //     // Loop through tasks inside the stage
  //     stage.tasks.forEach((task) => {
  //       let taskId = `${stageId}_Task${task.order_index}`;
  //       diagram += `${prevTaskId} --> ${taskId}(["✅ ${task.name}"]):::taskStyle;\n`; // Rounded shape for tasks
  //       prevTaskId = taskId;
  //     });

  //     prevStageId = prevTaskId;
  //   });

  //   // Mermaid styling
  //   diagram += `
  //     classDef startStyle fill:#ffcc00,stroke:#333,stroke-width:2px;
  //     classDef stageStyle fill:#0099ff,stroke:#003366,stroke-width:2px,color:white,font-weight:bold;
  //     classDef taskStyle fill:#66cc66,stroke:#004d00,stroke-width:2px,color:white,rx:10,ry:10;
  //   `;

  //   this.mermaidCode = diagram;
  // }
}
