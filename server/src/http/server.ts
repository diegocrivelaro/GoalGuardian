import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import z from 'zod';

import { env } from '../env';

import { createGoal } from '../functions/create-goal';
import { getWeekPendingGoals } from '../functions/get-week-pending-goals';
import { createGoalCompletion } from '../functions/create-goal-completion';

const app = fastify().withTypeProvider<ZodTypeProvider>();
const port = +env.SERVER_PORT;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.post(
  '/create-goal',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async req => {
    const { title, desiredWeeklyFrequency } = req.body;

    await createGoal({
      title,
      desiredWeeklyFrequency,
    });
  }
);

app.get('/peding-goals', async () => {
  const { getPendingGolas } = await getWeekPendingGoals();

  return { getPendingGolas };
});

app.post(
  '/goal-completions',
  {
    schema: {
      body: z.object({
        goalId: z.number().int(),
      }),
    },
  },
  async req => {
    const { goalId } = req.body;

    const result = await createGoalCompletion({
      goalId,
    });

    return result;
  }
);

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`O servidor foi iniciado na porta ${port}! 🚀🔥`);
  });
