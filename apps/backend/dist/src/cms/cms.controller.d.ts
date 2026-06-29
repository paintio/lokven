import { CmsService } from './cms.service';
export declare class CmsController {
    private cmsService;
    constructor(cmsService: CmsService);
    getFooterLinks(): Promise<{
        id: string;
        group: string;
        label: string;
        url: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getFooterLinksByGroup(group: string): Promise<{
        id: string;
        group: string;
        label: string;
        url: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getPage(slug: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    getPages(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }[]>;
    createPage(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    updatePage(id: string, data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    deletePage(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    createFooterLink(data: any): Promise<{
        id: string;
        group: string;
        label: string;
        url: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateFooterLink(id: string, data: any): Promise<{
        id: string;
        group: string;
        label: string;
        url: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteFooterLink(id: string): Promise<{
        id: string;
        group: string;
        label: string;
        url: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getSettings(): Promise<{
        id: string;
        group: string;
        label: string | null;
        updatedAt: Date;
        type: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    getSetting(key: string): Promise<{
        id: string;
        group: string;
        label: string | null;
        updatedAt: Date;
        type: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    createSetting(data: any): Promise<{
        id: string;
        group: string;
        label: string | null;
        updatedAt: Date;
        type: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateSetting(key: string, data: any): Promise<{
        id: string;
        group: string;
        label: string | null;
        updatedAt: Date;
        type: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    deleteSetting(key: string): Promise<{
        id: string;
        group: string;
        label: string | null;
        updatedAt: Date;
        type: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
