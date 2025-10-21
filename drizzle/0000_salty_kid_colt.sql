CREATE TABLE "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"nickname" varchar(256),
	"bio" text,
	"imageURI" text,
	"basename" text,
	"role" text,
	"skills" text[],
	"address" varchar(42),
	CONSTRAINT "cards_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"card_id" integer NOT NULL,
	"collect_card_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"owner_card_id" integer NOT NULL,
	"type" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_collect_card_id_cards_id_fk" FOREIGN KEY ("collect_card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_owner_card_id_cards_id_fk" FOREIGN KEY ("owner_card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;