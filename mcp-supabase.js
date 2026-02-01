import { createServer } from "supabase-mcp";

export const server = createServer({
    url: process.env.SERVER_URL,
    key: process.env.SUPABASE_SERVICE_ROLE
});
