import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private uploadsService;
    private readonly logger;
    constructor(uploadsService: UploadsService);
    uploadSingle(file: any): Promise<{
        url: string;
    }>;
    uploadMultiple(files: any[]): Promise<{
        urls: string[];
    }>;
    deleteFile(url: string): Promise<{
        success: boolean;
    }>;
}
