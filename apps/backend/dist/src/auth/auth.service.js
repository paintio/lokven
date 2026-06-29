"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma_service_1 = require("../prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { phone, email, password, name, isSeller, ...sellerData } = registerDto;
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ phone }, { email: email || undefined }],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Пользователь с таким телефоном или email уже существует');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                phone,
                email,
                password: hashedPassword,
                name,
                isSeller: isSeller || false,
                role: isSeller ? 'seller' : 'user',
                sellerStatus: isSeller ? 'pending' : 'approved',
                ...(isSeller && {
                    inn: sellerData.inn,
                    ogrn: sellerData.ogrn,
                    companyName: sellerData.companyName,
                    legalAddress: sellerData.legalAddress,
                    bankAccount: sellerData.bankAccount,
                    bik: sellerData.bik,
                    documents: sellerData.documents,
                }),
            },
        });
        const { password: _, ...result } = user;
        return {
            user: result,
            token: this.generateToken(user.id, user.role),
        };
    }
    async login(loginDto) {
        const { phone, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { phone },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Неверный телефон или пароль');
        }
        if (user.isBlocked) {
            throw new common_1.UnauthorizedException('Ваш аккаунт заблокирован');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Неверный телефон или пароль');
        }
        const { password: _, ...result } = user;
        return {
            user: result,
            token: this.generateToken(user.id, user.role),
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        listings: true,
                        ordersAsBuyer: true,
                        ordersAsSeller: true,
                        favorites: true,
                    },
                },
                listings: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        images: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { password, resetToken, resetTokenExpiry, ...result } = user;
        return result;
    }
    async updateProfile(userId, updateDto) {
        const { phone, email, ...data } = updateDto;
        if (phone || email) {
            const existing = await this.prisma.user.findFirst({
                where: {
                    OR: [{ phone: phone || undefined }, { email: email || undefined }],
                    NOT: { id: userId },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Телефон или email уже используются');
            }
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                phone,
                email,
            },
        });
        const { password, resetToken, resetTokenExpiry, ...result } = user;
        return result;
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Неверный текущий пароль');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Пароль успешно изменен' };
    }
    generateToken(userId, role) {
        return this.jwtService.sign({ sub: userId, role });
    }
    async validateAdmin(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        return user?.role === 'admin' ? user : null;
    }
    generateAdminToken(userId) {
        return jwt.sign({ sub: userId, type: 'admin_access' }, process.env.ADMIN_TOKEN_SECRET || 'admin-secret-key', { expiresIn: '7d' });
    }
    async saveAdminToken(userId, token) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                adminToken: token,
                adminTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
    }
    async verifyAdminToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET || 'admin-secret-key');
            return decoded && decoded.type === 'admin_access';
        }
        catch {
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map