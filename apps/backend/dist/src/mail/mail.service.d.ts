export declare class MailService {
    private transporter;
    constructor();
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendListingCreatedEmail(email: string, listingTitle: string, listingId: string): Promise<void>;
    sendListingModeratedEmail(email: string, listingTitle: string, status: string, note?: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendOrderNotificationEmail(email: string, orderId: string, total: number): Promise<void>;
    sendReviewNotificationEmail(email: string, reviewerName: string, rating: number): Promise<void>;
}
