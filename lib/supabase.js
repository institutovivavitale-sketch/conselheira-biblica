import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://clnudnluurvrudnqkobn.supabase.co";
const supabaseKey = "sb_publishable_v8sJLmYdnqtKtHaXL4UBfA_fS3wYXSU";

export const supabase = createClient(supabaseUrl, supabaseKey);