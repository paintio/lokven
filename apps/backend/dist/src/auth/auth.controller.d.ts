import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            phone: string;
            email: string | null;
            name: string | null;
            avatar: string | null;
            role: string;
            isBlocked: boolean;
            isVerified: boolean;
            isSeller: boolean;
            createdAt: Date;
            updatedAt: Date;
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
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            phone: string;
            email: string | null;
            name: string | null;
            avatar: string | null;
            role: string;
            isBlocked: boolean;
            isVerified: boolean;
            isSeller: boolean;
            createdAt: Date;
            updatedAt: Date;
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
        };
        token: string;
    }>;
    getProfile(req: any): Promise<{
        listings: ({
            images: {
                id: string;
                createdAt: Date;
                url: string;
                listingId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            price: number;
            currency: string;
            type: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            lat: number | null;
            lng: number | null;
            address: string | null;
            status: string;
            views: number;
            isPremium: boolean;
            premiumUntil: Date | null;
            moderationNote: string | null;
            moderationAt: Date | null;
            moderationBy: string | null;
            authorId: string;
        })[];
        _count: {
            listings: number;
            favorites: number;
            ordersAsBuyer: number;
            ordersAsSeller: number;
        };
        id: string;
        phone: string;
        email: string | null;
        name: string | null;
        avatar: string | null;
        role: string;
        isBlocked: boolean;
        isVerified: boolean;
        isSeller: boolean;
        createdAt: Date;
        updatedAt: Date;
        inn: string | null;
        ogrn: string | null;
        companyName: string | null;
        legalAddress: string | null;
        bankAccount: string | null;
        bik: string | null;
        documents: import("@prisma/client/runtime/library").JsonValue | null;
        sellerStatus: string;
        adminToken: string | null;
        adminTokenExpiry: Date | null;
    }>;
    updateProfile(req: any, updateDto: UpdateProfileDto): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string | null;
        avatar: string | null;
        role: string;
        isBlocked: boolean;
        isVerified: boolean;
        isSeller: boolean;
        createdAt: Date;
        updatedAt: Date;
        inn: string | null;
        ogrn: string | null;
        companyName: string | null;
        legalAddress: string | null;
        bankAccount: string | null;
        bik: string | null;
        documents: import("@prisma/client/runtime/library").JsonValue | null;
        sellerStatus: string;
        adminToken: string | null;
        adminTokenExpiry: Date | null;
    }>;
    changePassword(req: any, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    generateAdminToken(req: any, body: {
        userId: string;
    }): Promise<{
        token: string;
    }>;
    verifyAdminToken(body: {
        token: string;
    }): Promise<{
        valid: boolean;
    }>;
}
