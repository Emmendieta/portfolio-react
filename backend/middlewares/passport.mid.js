import env from "../config.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as PassportStrategy } from "passport-jwt";
import { usersRepository } from "../repositories/repository.js";
import { compareHash, createHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";

passport.use(
    "register",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            try {
                if (!req.body.first_name || !req.body.last_name) {
                    return done(null, null, { message: "Invalid Data!", statusCode: 400 });
                }
                let user = await usersRepository.readByFilter({ email });
                if (user) {
                    return done(null, null, { message: "Invalid Credentials!", statusCode: 401 });
                }
                req.body.password = createHash(password);
                user = await usersRepository.createOne(req.body);
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            try {
                let user = await usersRepository.readOneByFilter({ email });
                if (!user) {
                    return done(null, null, { message: "Invalid Credentials!", statusCode: 401 });
                }
                const verifyPassword = compareHash(password, user.password);
                if (!verifyPassword) {
                    return done(null, null, { message: "Invalid Credentials!", statusCode: 401 });
                }
                // Crear token JWT
                const data = { user_id: user._id, email: user.email, role: user.role };
                const token = createToken(data);
                user.token = token;
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "current",
    new PassportStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
            secretOrKey: env.SECRET
        },
        async (data, done) => {
            try {
                const { user_id, email, role } = data;
                const user = await usersRepository.readByFilter({ _id: user_id, email, role });
                if (!user) {
                    return done(null, null, { message: "Forbidden!", statusCode: 403 });
                }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "user",
    new PassportStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
            secretOrKey: env.SECRET
        },
        async (data, done) => {
            try {
                const { user_id, email, role } = data;
                const user = await usersRepository.readByFilter({ _id: user_id, email, role });
                if (!user) {
                    return done(null, null, { message: "Forbidden!", statusCode: 403 });
                }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "admin",
    new PassportStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
            secretOrKey: env.SECRET
        },
        async (data, done) => {
            try {
                const { user_id, email, role } = data;
                const user = await usersRepository.readByFilter({ _id: user_id, email, role });
                if (!user || user.role !== "admin") {
                    return done(null, null, { message: "Forbidden!", statusCode: 403 });
                }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

export default passport;
