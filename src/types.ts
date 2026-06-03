export type NodeType = 'trigger' | 'ai_model' | 'action' | 'condition' | 'database' | 'notification' | 'api';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  status: 'idle' | 'running' | 'success' | 'error';
  latency?: number;
  config?: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  nodeLabel: string;
  status: 'success' | 'info' | 'error' | 'warning';
  message: string;
  latency: number;
}

export interface MetricPoint {
  time: string;
  throughput: number;
  latency: number;
  errorRate: number;
}
