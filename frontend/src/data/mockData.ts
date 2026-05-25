import enquiriesData from '../../mock/enquiries.json';
import eventsData from '../../mock/events.json';
import followUpsData from '../../mock/followUps.json';
import dashboardData from '../../mock/dashboard.json';
import type {
  Enquiry,
  EnquiryEvent,
  EnquiryHistoryResponse,
  EnquiriesListResponse,
  FollowUp,
  FollowUpsListResponse,
  DashboardResponse,
  ActivityItem,
  DashboardMetric,
} from '../types';

const MS_MIN = 60_000;
const MS_HOUR = 3_600_000;

function enrichEnquiryTimestamps(enquiry: Enquiry): Enquiry {
  const now = Date.now();
  const offsets: Record<string, number> = {
    '550e8400-e29b-41d4-a716-446655440001': 2 * MS_MIN,
    '550e8400-e29b-41d4-a716-446655440005': 8 * MS_MIN,
    '550e8400-e29b-41d4-a716-446655440008': 4 * MS_MIN,
    '550e8400-e29b-41d4-a716-446655440010': 12 * MS_MIN,
    '550e8400-e29b-41d4-a716-446655440003': 35 * MS_MIN,
    '550e8400-e29b-41d4-a716-446655440002': 2 * MS_HOUR,
    '550e8400-e29b-41d4-a716-446655440007': 5 * MS_HOUR,
  };
  const offset = offsets[enquiry.id];
  if (offset === undefined) return enquiry;
  const updatedAt = new Date(now - offset).toISOString();
  return { ...enquiry, updatedAt };
}

function enrichFollowUpDueTimes(followUp: FollowUp): FollowUp {
  const now = Date.now();
  switch (followUp.id) {
    case 'fu-001':
      return { ...followUp, dueAt: new Date(now + 18 * MS_MIN).toISOString() };
    case 'fu-002':
      return { ...followUp, dueAt: new Date(now + 3 * MS_HOUR).toISOString() };
    case 'fu-003':
      return { ...followUp, dueAt: new Date(now - 2 * MS_HOUR).toISOString() };
    default:
      return followUp;
  }
}

function enrichActivityTimestamps(activity: ActivityItem[]): ActivityItem[] {
  const now = Date.now();
  const offsets = [3, 8, 15, 22, 28, 45].map((m) => m * MS_MIN);
  return activity.map((item, i) => ({
    ...item,
    timestamp: new Date(now - (offsets[i] ?? (i + 1) * MS_MIN)).toISOString(),
  }));
}

const enquiries = (enquiriesData as EnquiriesListResponse).items.map(
  enrichEnquiryTimestamps
);
const events = (eventsData as { events: EnquiryEvent[] }).events;
const followUps = (followUpsData as FollowUpsListResponse).items.map(
  enrichFollowUpDueTimes
);
const dashboard = dashboardData as {
  activity: ActivityItem[];
  priorityQueueIds: string[];
};

export function getLeads(): Enquiry[] {
  return enquiries.filter(
    (e) => e.conversationStatus !== 'escalated' && e.status !== 'closed'
  );
}

export function getEscalations(): Enquiry[] {
  return enquiries.filter(
    (e) => e.conversationStatus === 'escalated' || e.status === 'escalated'
  );
}

export function getFollowUps(): FollowUp[] {
  return followUps;
}

function buildDashboardMetrics(): DashboardMetric[] {
  const openCount = enquiries.filter((e) => e.status !== 'closed').length;
  const escalationCount = enquiries.filter(
    (e) => e.conversationStatus === 'escalated' || e.status === 'escalated'
  ).length;
  const matchedCount = enquiries.filter((e) => e.status === 'matched').length;
  const pendingResponse = enquiries.filter(
    (e) => e.status === 'matched' && e.unread
  ).length;
  const followUpsDue = followUps.filter(
    (f) => f.status === 'overdue' || f.status === 'due_today'
  ).length;
  const overdueCount = followUps.filter((f) => f.status === 'overdue').length;
  const processingCount = enquiries.filter((e) => e.status === 'processing').length;

  return [
    {
      id: 'metric-open',
      label: 'Open enquiries',
      value: openCount,
      trend: {
        direction: 'neutral',
        label: processingCount > 0 ? `${processingCount} processing now` : `${openCount} in queue`,
      },
      accentKey: 'primary',
    },
    {
      id: 'metric-escalations',
      label: 'Escalations',
      value: escalationCount,
      trend: {
        direction: escalationCount > 0 ? 'up' : 'neutral',
        label:
          escalationCount > 0 ? `${escalationCount} unresolved` : 'Queue clear',
      },
      accentKey: 'danger',
    },
    {
      id: 'metric-matched',
      label: 'SOP matched',
      value: matchedCount,
      trend: {
        direction: 'neutral',
        label:
          pendingResponse > 0
            ? `${pendingResponse} response pending`
            : 'Ready to send',
      },
      accentKey: 'success',
    },
    {
      id: 'metric-followups',
      label: 'Follow-ups due',
      value: followUpsDue,
      trend: {
        direction: overdueCount > 0 ? 'down' : 'neutral',
        label: overdueCount > 0 ? `${overdueCount} overdue` : 'On schedule today',
      },
      accentKey: 'warning',
    },
  ];
}

export function getDashboard(): DashboardResponse {
  const priorityQueue = dashboard.priorityQueueIds
    .map((id) => enquiries.find((e) => e.id === id))
    .filter((e): e is Enquiry => e !== undefined);

  return {
    metrics: buildDashboardMetrics(),
    activity: enrichActivityTimestamps(dashboard.activity),
    priorityQueue,
  };
}

export function getEnquiryById(id: string): Enquiry | undefined {
  return enquiries.find((e) => e.id === id);
}

export function getEnquiryHistory(id: string): EnquiryHistoryResponse | null {
  const enquiry = getEnquiryById(id);
  if (!enquiry) return null;

  const enquiryEvents = events
    .filter((e) => e.enquiryId === id)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return { enquiry, events: enquiryEvents };
}

export function getFollowUpByEnquiryId(enquiryId: string): FollowUp | undefined {
  return followUps.find((f) => f.enquiryId === enquiryId);
}

export function getOperationalCounts() {
  const leads = getLeads();
  const escalations = getEscalations();
  return {
    open: leads.length,
    unread: leads.filter((l) => l.unread).length,
    escalations: escalations.length,
    manager: escalations.filter((e) =>
      (e.escalationReason ?? '').toLowerCase().includes('manager')
    ).length,
    dueFollowUps: followUps.filter(
      (f) => f.status === 'overdue' || f.status === 'due_today'
    ).length,
    overdueFollowUps: followUps.filter((f) => f.status === 'overdue').length,
    priorityHigh: escalations.filter((e) => e.priority === 'high').length,
  };
}
