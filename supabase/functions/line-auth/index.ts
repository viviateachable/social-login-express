import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    if (path.endsWith('/login')) {
      return await handleLogin(req);
    } else if (path.endsWith('/callback')) {
      return await handleCallback(req);
    } else {
      return new Response('Not Found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }
  } catch (error) {
    console.error('Line auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})

async function handleLogin(req: Request) {
  console.log('Line login request received');
  
  const lineChannelId = Deno.env.get('LINE_CHANNEL_ID');
  const lineCallbackUrl = Deno.env.get('LINE_CALLBACK_URL');
  
  if (!lineChannelId || !lineCallbackUrl) {
    console.error('Missing Line configuration');
    return new Response(
      JSON.stringify({ error: 'Line configuration missing' }), 
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  // Generate state parameter for security
  const state = crypto.randomUUID();
  
  // Line OAuth URL
  const authUrl = `https://access.line.me/oauth2/v2.1/authorize?` +
    `response_type=code&` +
    `client_id=${lineChannelId}&` +
    `redirect_uri=${encodeURIComponent(lineCallbackUrl)}&` +
    `state=${state}&` +
    `scope=profile%20openid`;

  console.log('Generated Line auth URL:', authUrl);

  return new Response(
    JSON.stringify({ authUrl }), 
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleCallback(req: Request) {
  console.log('Line callback request received');
  
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    console.error('Line OAuth error:', error);
    const frontendUrl = Deno.env.get('FRONTEND_REDIRECT_URL') || '/';
    return Response.redirect(`${frontendUrl}?error=line_oauth_error`);
  }

  if (!code) {
    console.error('No authorization code received');
    const frontendUrl = Deno.env.get('FRONTEND_REDIRECT_URL') || '/';
    return Response.redirect(`${frontendUrl}?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (!tokenResponse.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user profile from Line
    const userProfile = await getLineUserProfile(tokenResponse.access_token);
    
    // Create or update user in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user session in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userProfile.email || `${userProfile.userId}@line.local`,
      options: {
        data: {
          full_name: userProfile.displayName,
          avatar_url: userProfile.pictureUrl,
          provider: 'line',
          line_user_id: userProfile.userId
        }
      }
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      throw authError;
    }

    // Redirect to frontend with session
    const frontendUrl = Deno.env.get('FRONTEND_REDIRECT_URL') || '/';
    const redirectUrl = `${frontendUrl}#access_token=${authData.properties?.access_token}&token_type=bearer`;
    
    return Response.redirect(redirectUrl);

  } catch (error) {
    console.error('Line callback error:', error);
    const frontendUrl = Deno.env.get('FRONTEND_REDIRECT_URL') || '/';
    return Response.redirect(`${frontendUrl}?error=callback_failed`);
  }
}

async function exchangeCodeForToken(code: string) {
  const lineChannelId = Deno.env.get('LINE_CHANNEL_ID')!;
  const lineChannelSecret = Deno.env.get('LINE_CHANNEL_SECRET')!;
  const lineCallbackUrl = Deno.env.get('LINE_CALLBACK_URL')!;

  const tokenUrl = 'https://api.line.me/oauth2/v2.1/token';
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: lineCallbackUrl,
    client_id: lineChannelId,
    client_secret: lineChannelSecret,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return await response.json();
}

async function getLineUserProfile(accessToken: string) {
  const profileUrl = 'https://api.line.me/v2/profile';
  
  const response = await fetch(profileUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Profile fetch failed: ${response.status}`);
  }

  return await response.json();
}