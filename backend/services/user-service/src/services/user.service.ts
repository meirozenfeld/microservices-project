import prisma from "../prisma/client";

export async function createUser(data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}) {
    return prisma.user.create({ data });
}


export async function getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}
