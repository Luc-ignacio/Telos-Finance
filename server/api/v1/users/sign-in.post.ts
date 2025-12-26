import { serverSupabaseClient } from "#supabase/server";
import { ResponseStatus } from "../../../types/api";

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    throw createError({
      statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
      statusMessage: error.message,
    });
  }

  return {
    url: data.url,
  };
});
