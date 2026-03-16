import { Request, Response, NextFunction } from 'express'
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case'
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/refresh-token.use-case'
import { ChangePasswordUseCase } from 'src/application/use-cases/auth/change-password.use-case'
import { Role } from 'src/domain/enums'

export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
    ) { }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.loginUseCase.execute(req.body);
            res.status(200).json({ success: true, message: 'Login successful', data: result });
        } catch (err) { next(err); }
    }

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.refreshTokenUseCase.execute(req.body);
            res.status(200).json({ success: true, message: 'Token refreshed', data: result });
        } catch (err) { next(err); }
    };
    changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.changePasswordUseCase.execute({
                userId: req.user!.userId,
                role: req.user!.role as Role,
                ...req.body,
            });
            res.status(200).json({ success: true, message: 'Password changed successfully' });
        } catch (err) { next(err); }
    };
    me = async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({ success: true, data: req.user });
    };
}