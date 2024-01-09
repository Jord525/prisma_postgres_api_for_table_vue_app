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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.findOne = exports.updateOneTable = exports.create = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1, sortByProductName, sortByQuantity, byDefault, } = req.query;
    const correntPage = Math.max(Number(page || 1), 1);
    const tables = yield prisma.table.findMany({
        skip: (correntPage - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            productName: sortByProductName,
            quantity: sortByQuantity,
            createdAt: byDefault,
        },
    });
    const count = yield prisma.table.count();
    res.send({
        tables,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: Number(page),
    });
});
exports.findAll = findAll;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, quantity, weight, purchasePrice, sellingPrice } = req.body;
    const result = yield prisma.table.create({
        data: {
            productName,
            quantity,
            weight,
            purchasePrice,
            sellingPrice,
        },
    });
    res.json(result);
});
exports.create = create;
const updateOneTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { productName, quantity, weight, purchasePrice, sellingPrice } = req.body;
    const update = yield prisma.table.update({
        where: {
            id: Number(id),
        },
        data: {
            productName,
            quantity,
            weight,
            purchasePrice,
            sellingPrice,
        },
    });
    res.json(update);
});
exports.updateOneTable = updateOneTable;
const findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const findOne = yield prisma.table.findMany({
            where: {
                productName: {
                    search: name,
                },
            },
        });
        res.json(findOne);
    }
    catch (error) {
        console.log(error);
    }
});
exports.findOne = findOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleteOne = yield prisma.table.delete({
        where: { id: Number(id) },
    });
    res.json(deleteOne);
});
exports.deleteOne = deleteOne;
