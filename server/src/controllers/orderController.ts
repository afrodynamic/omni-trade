import { Request, Response } from 'express';

import prisma from '../../../prisma/client';

export const createOrder = async(request: Request, response: Response) => {
  console.log(request.body);
  console.log(request.body.orderId);
  if (!request.body || !request.body?.orderId) {
    response.status(500).send({ error: 'Missing order ID' });
    return;
  }

  const order = await prisma.order.create({
    data: {
      orderId: request.body.orderId,
    }
  });

  response.status(200).json(order);
};
