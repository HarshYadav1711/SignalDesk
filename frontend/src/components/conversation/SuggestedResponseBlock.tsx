import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';

interface SuggestedResponseBlockProps {
  sopTitle: string;
  response: string;
}

export function SuggestedResponseBlock({
  sopTitle,
  response,
}: SuggestedResponseBlockProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={18} color={colors.success} />
        <Text style={styles.headerText}>Suggested response — {sopTitle}</Text>
      </View>
      <Text style={styles.response}>{response}</Text>
      <Text style={styles.hint}>Copy and send via the customer's channel</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.successMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.successBorder,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerText: {
    ...typography.captionMedium,
    color: colors.success,
    flex: 1,
    lineHeight: 18,
  },
  response: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
