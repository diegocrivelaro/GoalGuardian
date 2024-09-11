import dayjs from "dayjs";

import { client, db } from "./index";
import { goalCompletions, goals } from "./schema";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const resultGoals = await db
    .insert(goals)
    .values([
      {
        title: "Acordar Cedo",
        desiredWeeklyFrequency: 6,
      },
      {
        title: "Musculação",
        desiredWeeklyFrequency: 5,
      },
      {
        title: "Meditação",
        desiredWeeklyFrequency: 7,
      },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    {
      goalId: resultGoals[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: resultGoals[1].id,
      createdAt: startOfWeek.add(1, "day").toDate(),
    },
    {
      goalId: resultGoals[2].id,
      createdAt: startOfWeek.add(3, "day").toDate(),
    },
  ]);
}

seed().finally(() => {
  client.end();
});
