import { Request, Response } from "express";
import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
export const getAllUsers = async (req: Request, res: Response) => {
  const getAll = await prisma.user.findMany({});

  res.status(200).json(getAll);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isValidPass = await bcrypt.compare(password, user?.password as any);

    if (!isValidPass) {
      return res.status(404).json({
        message: "invalid password or login!",
      });
    }
    const token = jwt.sign(
      {
        id: user?.id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      ...user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error логин: " + error,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const salt = await bcrypt.genSalt(5);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      } as any,
    });
    const token = jwt.sign(
      {
        id: user.id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );
    res.status(201).json({
      ...user,
      token,
    });
  } catch (error) {
    res.status(400).send({
      errors: [error],
    });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
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
      {
        ...user,
      },
    ]);
  } catch (error) {
    return res.send({
      message: "something went wrong",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const update = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      email,
    },
  });
  res.json(update);
};
