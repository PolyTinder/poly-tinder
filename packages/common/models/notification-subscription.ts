export interface NotificationSubscription {
  endpoint: string;
  auth: string;
  p256dh: string;
  expirationTime?: string;
  userId: number;
}
