import conversationsData from "../../mock/conversations.json";
import dashboardData from "../../mock/dashboard.json";
import escalationsData from "../../mock/escalations.json";
import followupsData from "../../mock/followups.json";
import leadsData from "../../mock/leads.json";
import type {
  ConversationDetail,
  ConversationListItem,
  DashboardMetric,
} from "../types";

export const dashboard = {
  ...dashboardData,
  metrics: dashboardData.metrics as DashboardMetric[],
  priorityQueue: dashboardData.priorityQueue as ConversationListItem[],
};
export const leads = leadsData.leads as ConversationListItem[];
export const escalations = escalationsData.escalations as ConversationListItem[];
export const followUps = followupsData.followUps as ConversationListItem[];

const conversationMap = conversationsData.conversations as Record<
  string,
  ConversationDetail
>;

export function getConversation(id: string): ConversationDetail | undefined {
  return conversationMap[id];
}
