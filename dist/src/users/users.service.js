"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.me = exports.register = exports.login = exports.getAllUsers = void 0;
const db_1 = require("../utils/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAll = yield db_1.prisma.user.findMany({});
    res.status(200).json(getAll);
});
exports.getAllUsers = getAllUsers;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const isValidPass = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isValidPass) {
            return res.status(404).json({
                message: "invalid password or login!",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user === null || user === void 0 ? void 0 : user.id,
        }, "secret", {
            expiresIn: "30d",
        });
        res.status(201).json(Object.assign(Object.assign({}, user), { token }));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error логин: " + error,
        });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    const salt = yield bcrypt_1.default.genSalt(5);
    const passwordHash = yield bcrypt_1.default.hash(password, salt);
    try {
        const user = yield db_1.prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
        }, "secret", {
            expiresIn: "30d",
        });
        res.status(201).json(Object.assign(Object.assign({}, user), { token }));
    }
    catch (error) {
        res.status(400).send({
            errors: [error],
        });
    }
});
exports.register = register;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.prisma.user.findFirst({
            where: {
                id: req.userId,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        res.json([
            Object.assign({}, user),
        ]);
    }
    catch (error) {
        return res.send({
            message: "something went wrong",
        });
    }
});
exports.me = me;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email } = req.body;
    const update = yield db_1.prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            name,
            email,
        },
    });
    res.json(update);
});
exports.updateUser = updateUser;
