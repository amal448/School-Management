
import { Router } from 'express';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from 'src/domain/enums';
import { TeacherController } from '../controllers/teacher.controller';
import { AssignDeptSchema, RegisterTeacherSchema, TeacherQuerySchema, UpdateTeacherSchema } from '../validators';

type AuthMW = ReturnType<typeof createAuthMiddleware>;


export const createTeacherRouter = (ctrl: TeacherController, { authenticate, authorize }: AuthMW): Router => {
  
  const router = Router();
  router.post('/',authenticate, authorize(Role.MANAGER,Role.ADMIN),validate(RegisterTeacherSchema),ctrl.register,);
  router.get('/',authenticate, authorize(Role.MANAGER,Role.ADMIN),validate(TeacherQuerySchema, 'query'),ctrl.list,);
  router.get('/:id',authenticate, authorize(Role.MANAGER, Role.TEACHER,Role.ADMIN),ctrl.getById,);
  router.patch('/:id',authenticate, authorize(Role.MANAGER, Role.TEACHER,Role.ADMIN),validate(UpdateTeacherSchema),ctrl.update,);
  router.patch('/:id/department',authenticate, authorize(Role.MANAGER,Role.ADMIN),validate(AssignDeptSchema),ctrl.assignDept);
  router.delete('/:id',authenticate, authorize(Role.MANAGER,Role.ADMIN),ctrl.remove,
  );

  return router;
};
