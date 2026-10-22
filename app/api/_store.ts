export type UserRole = 'requester' | 'approver';

export type ActionStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXECUTED'
  | 'EXECUTION_DENIED';

export interface ActionEvent {
  id: string;
  at: string;
  message: string;
}

export interface ActionReceipt {
  id: string;
  executedAt: string;
  amountVnd: number;
  recipientName: string;
}

export interface ActionRequest {
  id: string;
  actionType: 'PAYMENT';
  status: ActionStatus;
  requestedBy: string;
  amountVnd: number;
  approvalThresholdVnd: number;
  recipientId: string;
  recipientName: string;
  invoiceId: string;
  reason: string;
  executionMode: 'SIMULATED';
  tideApprovalSignature: string | null;
  createdAt: string;
  approvedAt?: string | null;
  executedAt?: string | null;
  events: ActionEvent[];
  receipt: ActionReceipt | null;
}

export const STORE = {
  users: {
    'requester-demo': { id: 'usr_requester_01', name: 'Jamie Chen (AI Requester)', username: 'requester-demo', role: 'requester' as UserRole, tideAuthenticated: true },
    'approver-demo': { id: 'usr_approver_01', name: 'Alex Morgan (TideCloak Approver)', username: 'approver-demo', role: 'approver' as UserRole, tideAuthenticated: true },
  },
  actions: [
    {
      id: 'REQ-DEMO-001',
      actionType: 'PAYMENT',
      status: 'PENDING_APPROVAL',
      requestedBy: 'requester-demo',
      amountVnd: 15000000,
      approvalThresholdVnd: 10000000,
      recipientId: 'vendor-demo-001',
      recipientName: 'Demo Office Supplies',
      invoiceId: 'INV-DEMO-001',
      reason: 'Thanh toán hóa đơn thiết bị văn phòng giả lập',
      executionMode: 'SIMULATED',
      tideApprovalSignature: null,
      createdAt: '2026-10-22T10:00:00.000Z',
      approvedAt: null,
      executedAt: null,
      events: [
        { id: 'evt-001', at: '2026-10-22T10:00:00.000Z', message: 'Proposal created · awaiting TideCloak approval' },
      ],
      receipt: null,
    },
  ] as ActionRequest[],
};

export function resetStore() {
  STORE.actions = [
    {
      id: 'REQ-DEMO-001',
      actionType: 'PAYMENT',
      status: 'PENDING_APPROVAL',
      requestedBy: 'requester-demo',
      amountVnd: 15000000,
      approvalThresholdVnd: 10000000,
      recipientId: 'vendor-demo-001',
      recipientName: 'Demo Office Supplies',
      invoiceId: 'INV-DEMO-001',
      reason: 'Thanh toán hóa đơn thiết bị văn phòng giả lập',
      executionMode: 'SIMULATED',
      tideApprovalSignature: null,
      createdAt: new Date().toISOString(),
      approvedAt: null,
      executedAt: null,
      events: [
        { id: 'evt-001', at: new Date().toISOString(), message: 'Proposal created · awaiting TideCloak approval' },
      ],
      receipt: null,
    },
  ];
}
