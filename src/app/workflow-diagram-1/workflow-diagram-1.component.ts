import { Component, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import * as dagre from 'dagre-d3';
@Component({
  selector: 'app-workflow-diagram-1',
  standalone: true,
  imports: [],
  // templateUrl: './workflow-diagram-1.component.html',
  styleUrl: './workflow-diagram-1.component.css',
  template: `<svg width="800" height="500"><g></g></svg>`,
  styles: [
    `
      svg {
        border: 1px solid #ddd;
      }
    `,
  ],
})
export class WorkflowDiagram1Component {
  private workflow = {
    workflowName: 'Approval Process',
    stages: [
      {
        stageId: 'stage1',
        stageName: 'Initiation',
        slaTime: '2 days',
        tasks: [
          {
            taskId: 'task1',
            taskName: 'Submit Request',
            user: 'John Doe',
            slaTime: '1 day',
          },
          {
            taskId: 'task2',
            taskName: 'Review Request',
            user: 'Manager',
            slaTime: '1 day',
          },
        ],
      },
      {
        stageId: 'stage2',
        stageName: 'Approval',
        slaTime: '3 days',
        tasks: [
          {
            taskId: 'task3',
            taskName: 'Approve Request',
            user: 'Director',
            slaTime: '2 days',
          },
        ],
      },
    ],
  };

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.createDiagram();
  }

  private createDiagram() {
    // ✅ Ensure Graph Initialization is Correct
    const g: dagreD3.graphlib.Graph = new dagreD3.graphlib.Graph()
      .setGraph({ rankdir: 'TB' }) // Top to Bottom direction
      .setDefaultNodeLabel(() => ({})) // 🔹 Prevents undefined issues
      .setDefaultEdgeLabel(() => ({})); // 🔹 Ensures edges have default labels

    // ✅ Ensure 'workflow' object is valid before accessing it
    if (!this.workflow || !this.workflow.stages) {
      console.error('Workflow data is undefined or incorrect.');
      return;
    }

    // ✅ Add nodes for stages
    this.workflow.stages.forEach((stage) => {
      g.setNode(stage.stageId, {
        label: `${stage.stageName}\nSLA: ${stage.slaTime}`,
        class: 'stage',
      });

      // ✅ Ensure 'tasks' exist before looping
      if (stage.tasks && stage.tasks.length > 0) {
        stage.tasks.forEach((task) => {
          g.setNode(task.taskId, {
            label: `${task.taskName}\nUser: ${task.user}\nSLA: ${task.slaTime}`,
            class: 'task',
          });

          // Link stage to tasks
          g.setEdge(stage.stageId, task.taskId);
        });
      }
    });

    // ✅ Ensure valid stage linking
    for (let i = 0; i < this.workflow.stages.length - 1; i++) {
      const currentStage = this.workflow.stages[i];
      const nextStage = this.workflow.stages[i + 1];

      if (currentStage.tasks && currentStage.tasks.length > 0) {
        g.setEdge(
          currentStage.tasks[currentStage.tasks.length - 1].taskId,
          nextStage.stageId
        );
      }
    }

    // ✅ Fix D3 Selection Types
    const svg = d3.select<SVGSVGElement, unknown>(
      this.el.nativeElement.querySelector('svg')
    );
    const inner = svg.select<SVGGElement>('g');

    // ✅ Create Renderer
    const render = new dagreD3.render();

    // ✅ Render the Graph
    render(inner as any, g as any);

    // ✅ Center the diagram
    const { width, height } = svg.node()!.getBBox();
    svg.attr('viewBox', `0 0 ${width + 50} ${height + 50}`);
  }
}
