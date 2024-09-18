ALTER TABLE "goal_completions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "goal_completions" ALTER COLUMN "created_at" SET NOT NULL;