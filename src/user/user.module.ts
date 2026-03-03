import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: []
})
export class UserModule {}