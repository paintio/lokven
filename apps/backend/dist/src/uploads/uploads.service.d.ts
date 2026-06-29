export declare class UploadsService {
    private readonly logger;
    private readonly uploadDir;
    constructor();
    saveFile(file: any): Promise<string>;
    deleteFile(filename: string): Promise<void>;
    saveMultiple(files: any[]): Promise<string[]>;
}
