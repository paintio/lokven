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
var UploadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let UploadsService = UploadsService_1 = class UploadsService {
    constructor() {
        this.logger = new common_1.Logger(UploadsService_1.name);
        this.uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            this.logger.log(`Создана папка для загрузок: ${this.uploadDir}`);
        }
    }
    async saveFile(file) {
        this.logger.log(`Получен файл: ${file.originalname}, тип: ${file.mimetype}, размер: ${file.size}`);
        if (!file) {
            throw new common_1.BadRequestException('Файл не загружен');
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Допустимы только изображения (JPEG, PNG, GIF, WEBP, SVG)');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new common_1.BadRequestException('Размер файла не должен превышать 10MB');
        }
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}${ext}`;
        const filepath = path.join(this.uploadDir, filename);
        fs.writeFileSync(filepath, file.buffer);
        this.logger.log(`Файл сохранен: ${filepath}`);
        const url = `/uploads/${filename}`;
        return url;
    }
    async deleteFile(filename) {
        const filepath = path.join(this.uploadDir, path.basename(filename));
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            this.logger.log(`Файл удален: ${filepath}`);
        }
    }
    async saveMultiple(files) {
        const urls = [];
        for (const file of files) {
            const url = await this.saveFile(file);
            urls.push(url);
        }
        return urls;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = UploadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map