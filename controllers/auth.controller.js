import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (request, h) => {
  const { name, email, password } = request.payload;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user'
      }
    });

    return h.response({
      message: 'User registered',
      user: {
        id: user.id,
        email: user.email
      }
    }).code(201);

  } catch (error) {
    return h.response({
      error: 'Email already exists'
    }).code(400);
  }
};

export const login = async (request, h) => {
  const { email, password } = request.payload;

  // Hittar användaren baserat på email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return h.response({ error: 'Username or password is incorrect.' }).code(401);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return h.response({ error: 'Username or password is incorrect.' }).code(401);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    // Returnerar token och användarinformation så frontend kan läsa ut roll
    token, user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};