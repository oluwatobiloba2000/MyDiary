import {Router} from 'express';
import  Authentication from '../controllers/auth';
const router = Router();


router.post('/users/login', Authentication.login);
router.post('/users/signup', Authentication.signup);


export default router;