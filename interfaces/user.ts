export interface User {
  id: string;
  factors: null;
  aud: string;
  email: string;
  phone: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  role: string;
  aal: string;
  amr: Amr[];
  session_id: string;
  avatar_url?: string;
  video_order?: string;
}

interface AppMetadata {
  provider: string;
  providers: string[];
}

interface UserMetadata {
  username: string;
}

interface Amr {
  method: string;
  timestamp: number;
}
