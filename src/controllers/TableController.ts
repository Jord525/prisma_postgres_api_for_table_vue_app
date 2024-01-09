import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const findAll = async (req: Request, res: Response) => {
  const {
    limit = 10,
    page = 1,
    sortByProductName,
    sortByQuantity,
    byDefault,
  } = req.query;
  const correntPage = Math.max(Number(page || 1), 1);
  const tables = await prisma.table.findMany({
    skip: (correntPage - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      productName: sortByProductName as Prisma.SortOrder,
      quantity: sortByQuantity as Prisma.SortOrder,
      createdAt: byDefault as Prisma.SortOrder,
    },
  });
  const count = await prisma.table.count();
  res.send({
    tables,
    totalPages: Math.ceil(count / Number(limit)),
    currentPage: Number(page),
  });
};

export const create = async (req: Request, res: Response) => {
  const { productName, quantity, weight, purchasePrice, sellingPrice } =
    req.body;
  const result = await prisma.table.create({
    data: {
      productName,
      quantity,
      weight,
      purchasePrice,
      sellingPrice,
    },
  });
  res.json(result);
};

export const updateOneTable = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productName, quantity, weight, purchasePrice, sellingPrice } =
    req.body;
  const update = await prisma.table.update({
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
};

export const findOne = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const findOne = await prisma.table.findMany({
      where: {
        productName: {
          search: name,
        },
      },
    });
    res.json(findOne);
  } catch (error) {
    console.log(error);
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleteOne = await prisma.table.delete({
    where: { id: Number(id) },
  });
  res.json(deleteOne);
};
