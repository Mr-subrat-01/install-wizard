import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2xvZ2luIiwiaWF0IjoxNzQyNzIwMTM4LCJleHAiOjE3NDI3MjM3MzgsIm5iZiI6MTc0MjcyMDEzOCwianRpIjoiSlNrRkl0VllEelQ2MW04YyIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3Iiwib3JnYW5pemF0aW9uX2lkIjoyfQ.2mQoYJOiBYe2LvfC0NqdLEiZAKaqatAoUP867eVPI4o';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  insertWorkflow(workflowData: any): Observable<any> {
    const payload = { ...workflowData, department_id: 1 };
    return this.http.post(`${this.apiUrl}/wf`, payload, {
      headers: this.getHeaders(),
    });
  }

  updateWorkflow(workflowId: number, workflowData: any): Observable<any> {
    const payload = { ...workflowData, department_id: 1 };
    return this.http.put(`${this.apiUrl}/wf/${workflowId}`, payload, {
      headers: this.getHeaders(),
    });
  }

  insertRule(ruleName: string, ruleDescription: string): Observable<any> {
    const payload = {
      name: ruleName,
      description: ruleDescription,
    };
    return this.http.post<any>(`${this.apiUrl}/rule`, payload, {
      headers: this.getHeaders()
    });
  }

  insertStageWithTask(data:any,wid:number):Observable<any> {
    return this.http.post(`${this.apiUrl}/create-wizard/${wid}`, data, {
      headers: this.getHeaders(),
    });
  }
}
