import { PrismaService } from '../prisma.service';
export declare class AdminController {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        totalListings: number;
        totalOrders: number;
        totalRevenue: number;
        pendingListings: number;
        activeListings: number;
        newUsersToday: number;
        newListingsToday: number;
        totalReviews: number;
        averageRating: number;
    }>;
    getUsers(): Promise<({
        _count: {
            listings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        phone: string;
        email: string | null;
        password: string;
        avatar: string | null;
        role: string;
        isBlocked: boolean;
        isVerified: boolean;
        isSeller: boolean;
        inn: string | null;
        ogrn: string | null;
        companyName: string | null;
        legalAddress: string | null;
        bankAccount: string | null;
        bik: string | null;
        documents: import("@prisma/client/runtime/library").JsonValue | null;
        sellerStatus: string;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        adminToken: string | null;
        adminTokenExpiry: Date | null;
    })[]>;
    toggleBlock(id: string, body: {
        isBlocked: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        phone: string;
        email: string | null;
        password: string;
        avatar: string | null;
        role: string;
        isBlocked: boolean;
        isVerified: boolean;
        isSeller: boolean;
        inn: string | null;
        ogrn: string | null;
        companyName: string | null;
        legalAddress: string | null;
        bankAccount: string | null;
        bik: string | null;
        documents: import("@prisma/client/runtime/library").JsonValue | null;
        sellerStatus: string;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        adminToken: string | null;
        adminTokenExpiry: Date | null;
    }>;
    changeRole(id: string, body: {
        role: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        phone: string;
        email: string | null;
        password: string;
        avatar: string | null;
        role: string;
        isBlocked: boolean;
        isVerified: boolean;
        isSeller: boolean;
        inn: string | null;
        ogrn: string | null;
        companyName: string | null;
        legalAddress: string | null;
        bankAccount: string | null;
        bik: string | null;
        documents: import("@prisma/client/runtime/library").JsonValue | null;
        sellerStatus: string;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        adminToken: string | null;
        adminTokenExpiry: Date | null;
    }>;
    getListings(status?: string, limit?: string): Promise<({
        images: {
            id: string;
            url: string;
            createdAt: Date;
            listingId: string;
        }[];
        author: {
            id: string;
            name: string;
            phone: string;
            isSeller: boolean;
            companyName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        description: string | null;
        price: number;
        currency: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        lat: number | null;
        lng: number | null;
        address: string | null;
        authorId: string;
        status: string;
        views: number;
        isPremium: boolean;
        premiumUntil: Date | null;
        moderationNote: string | null;
        moderationAt: Date | null;
        moderationBy: string | null;
    })[]>;
    moderateListing(id: string, body: {
        status: string;
        moderationNote?: string;
        moderatorId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        title: string;
        description: string | null;
        price: number;
        currency: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        lat: number | null;
        lng: number | null;
        address: string | null;
        authorId: string;
        status: string;
        views: number;
        isPremium: boolean;
        premiumUntil: Date | null;
        moderationNote: string | null;
        moderationAt: Date | null;
        moderationBy: string | null;
    }>;
    getCategories(): Promise<({
        _count: {
            children: number;
        };
    } & {
        id: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string | null;
        description: string | null;
        slug: string;
        parentId: string | null;
    })[]>;
    createCategory(data: any): Promise<{
        id: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string | null;
        description: string | null;
        slug: string;
        parentId: string | null;
    }>;
    updateCategory(id: string, data: any): Promise<{
        id: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string | null;
        description: string | null;
        slug: string;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        icon: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        color: string | null;
        description: string | null;
        slug: string;
        parentId: string | null;
    }>;
    getTaxes(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        rate: number;
    }[]>;
    createTax(data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        rate: number;
    }>;
    toggleTax(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        rate: number;
    }>;
    deleteTax(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        rate: number;
    }>;
    getOrders(): Promise<({
        listing: {
            title: string;
        };
        buyer: {
            name: string;
            phone: string;
        };
        seller: {
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tax: number;
        status: string;
        listingId: string;
        total: number;
        commission: number;
        netTotal: number;
        buyerId: string;
        sellerId: string;
    })[]>;
    getPayments(): Promise<({
        order: {
            id: string;
        };
        user: {
            name: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        amount: number;
        method: string;
        transactionId: string | null;
        orderId: string;
    })[]>;
    getReviews(): Promise<({
        listing: {
            id: string;
            title: string;
        };
        seller: {
            id: string;
            name: string;
        };
        reviewer: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string;
        rating: number;
        sellerId: string;
        orderId: string;
        text: string | null;
        reviewerId: string;
    })[]>;
    deleteReview(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string;
        rating: number;
        sellerId: string;
        orderId: string;
        text: string | null;
        reviewerId: string;
    }>;
    exportData(type: string): Promise<any[] | {
        error: string;
    }>;
    saveSettings(data: any): Promise<{
        success: boolean;
    }>;
    getNotifications(): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: string;
        message: string;
        title: string;
        userId: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        type: string;
        message: string;
        title: string;
        userId: string;
        isRead: boolean;
    }>;
    sendAllNotifications(body: {
        title: string;
        message: string;
        type: string;
    }): Promise<{
        success: boolean;
        sent: number;
    }>;
    getAnalytics(period?: string): Promise<{
        dailyStats: {
            date: any;
            users: number;
            listings: number;
            orders: number;
        }[];
        categoryStats: {
            name: string;
            value: number;
        }[];
        userActivity: {
            hour: string;
            active: number;
        }[];
        revenueStats: {
            month: any;
            revenue: number;
            orders: number;
        }[];
        topCategories: {
            name: string;
            count: number;
        }[];
        statusStats: {
            name: string;
            value: number;
        }[];
    }>;
}
