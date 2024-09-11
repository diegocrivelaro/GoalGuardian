CREATE TABLE IF NOT EXISTS "goal_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone,
	"goal_id" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_completions" ADD CONSTRAINT "goal_completions_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
