import db from "../db/index";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {response as httpResponse} from "../helpers/http-response";

class Authentication {

    static async login(req, res, next) {
        const { username, password } = req.body;

        try {
            if (!username || !password) {
                return res.status(400).json({
                    message: 'all fields required',
                    code: 400
                })
            }

            const userExistQuery = 'SELECT * FROM users WHERE username=$1';
            const userExistValue = [username]
            const userExist = await db.query(userExistQuery, userExistValue);
            if (userExist.rows[0]) {
                const match = await bcrypt.compare(
                    password,
                    userExist.rows[0].password,
                );

                if (match) {
                    return jwt.sign({
                        username: userExist.rows.username,
                        id: userExist.rows.id
                    }, process.env.SECRET_JWT_KET, { expiresIn: '7d' }, function (err, token) {
                        if (err) {
                            return res.status(403).send(err);
                        } else {
                            return res.status(200).json({
                                message: "login success",
                                token: token
                            })
                        }
                    })
                } else {
                    return res.status(403).json({
                        message: "Incorrect username and password",
                        code: 403
                    })
                }
            }

            return res.status(403).json({
                message: "Incorrect username and password",
                code: 403
            })
        } catch (error) {
           return httpResponse.error(res, 500, error.message, "Internal server error");
        }
    }




    static async signup(req, res, next) {
        const { username,
            password,
            firstname,
            lastname,
            email
        } = req.body;

        try {
            if (!username || !password) {
                return res.status(400).json({
                    message: 'all fields required',
                    code: 400
                })
            }

            const userExist = await db.query('SELECT * FROM users WHERE username=$1', [username]);
            if (userExist.rows[0]) {
                return res.status(400).json({
                    message: "username already taken",
                    code: 400
                })
            }

            //  hash the incoming password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const insertedUser = await db.query('INSERT INTO users (username,firstname, lastname,email, password) VALUES($1, $2) RETURNING *', [username, firstname, lastname, email, hashedPassword]);

            jwt.sign({
                username: insertedUser.rows[0].username,
                id: insertedUser.rows[0].id
            }, process.env.SECRET_JWT_KET, { expiresIn: '7d' }, (err, token) => {
                if (err) {
                    return res.status(403).send(err);
                } else {
                    return res.status(201).json({
                        user: insertedUser.rows,
                        message: "user created successfully",
                        token
                    })
                }
            })

        } catch (error) {
            return httpResponse.error(res, 500, error.message, "Internal server error");
        }
    }
}

export default Authentication;
