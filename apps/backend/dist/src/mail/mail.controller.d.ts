import { MailService } from './mail.service';
export declare class MailController {
    private mailService;
    constructor(mailService: MailService);
    testEmail(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    testListingEmail(body: {
        email: string;
        title: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
