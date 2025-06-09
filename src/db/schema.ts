import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// drizzle commands
// npx drizzle-kit generate
// npx drizzle-kit migrate
// npx drizzle-kit studio --port=3000

export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 1000 }).notNull(),
  authorId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
