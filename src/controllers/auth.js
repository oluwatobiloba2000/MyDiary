/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db/index';
import httpResponse from '../helpers/http-response';
import validate from '../middleware/auth.validation';

/**
 * @class Authentication
 *
 * @description  Authentication for users
 */

class Authentication {
  /**
    * @static
    *
    * @description login for users
    * @memberOf Authentication
    */

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      if (!username || !password) {
        return res.status(400).json({
          message: 'all fields required',
          code: 400,
        });
      }

      const validationError = validate.login(username, password);
      if (validationError.message) {
        return res.status(400).json({
          status: 'validation error',
          code: 400,
          message: validationError.message,
        });
      }

      const userExistQuery = 'SELECT * FROM users WHERE username=$1';
      const userExistValue = [username];
      const userExist = await db.query(userExistQuery, userExistValue);
      if (userExist.rows[0]) {
        const match = await bcrypt.compare(
          password,
          userExist.rows[0].password,
        );

        if (match) {
          return jwt.sign({
            username: userExist.rows.username,
            id: userExist.rows.id,
          }, process.env.SECRET_JWT_KET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
              return res.status(403).send(err);
            }
            return res.status(200).json({
              message: 'login success',
              token,
            });
          });
        }
        return res.status(403).json({
          message: 'Incorrect username and password',
          code: 403,
        });
      }

      return res.status(403).json({
        message: 'Incorrect username and password',
        code: 403,
      });
    } catch (error) {
      return httpResponse.error(res, 500, error.message, 'server error');
    }
  }

  /**
  * @static
  *
  * @description signup for users
  * @memberOf Authentication
  */

  static async signup(req, res) {
    const {
      username,
      password,
      firstname,
      lastname,
      email,
    } = req.body;

    try {
      if (!username || !password) {
        return res.status(400).json({
          message: 'all fields required',
          code: 400,
        });
      }

      const validationError = validate.signup(username, password, firstname, lastname, email);
      if (validationError.message) {
        return res.status(400).json({
          status: 'validation error',
          code: 400,
          message: validationError.message,
        });
      }

      const userExist = await db.query('SELECT * FROM users WHERE username=$1', [username]);
      if (userExist.rows[0]) {
        return res.status(400).json({
          message: 'username already taken',
          code: 400,
        });
      }

      //  hash the incoming password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const insertedUser = await db.query('INSERT INTO users (username,firstname, lastname,email, password) VALUES($1, $2, $3, $4, $5) RETURNING *', [username, firstname, lastname, email, hashedPassword]);

      return jwt.sign({
        username: insertedUser.rows[0].username,
        id: insertedUser.rows[0].id,
      }, process.env.SECRET_JWT_KET, { expiresIn: '7d' }, (err, token) => {
        if (err) {
          return res.status(403).send(err);
        }
        return res.status(201).json({
          user: insertedUser.rows,
          message: 'user created successfully',
          token,
        });
      });
    } catch (error) {
      return httpResponse.error(res, 500, error.message, 'Internal server error');
    }
  }
}

export default Authentication;
