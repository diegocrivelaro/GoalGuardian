import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import { eq, and, lte, gte, count, sql } from 'drizzle-orm';

dayjs.extend(weekOfYear);

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

  const getGoalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  );

  const getGoalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const getPendingGolas = await db
    .with(getGoalsCreatedUpToWeek, getGoalCompletionCounts)
    .select({
      id: getGoalsCreatedUpToWeek.id,
      title: getGoalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: getGoalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${getGoalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(getGoalsCreatedUpToWeek)
    .leftJoin(
      getGoalCompletionCounts,
      eq(getGoalCompletionCounts.goalId, getGoalsCreatedUpToWeek.id)
    );

  return {
    getPendingGolas,
  };
}
