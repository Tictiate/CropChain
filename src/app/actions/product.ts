"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function addProduct(formData: FormData) {
  const session = await auth();
  if (!session || !session.user.id) return { error: "Unauthorized" };

  const crop_name = formData.get("cropName") as string;
  const origin = formData.get("origin") as string;
  const quantity = formData.get("quantity") as string;
  const quality = formData.get("quality") as string;
  const expected_price = parseFloat(formData.get("price") as string);
  const location = formData.get("location") as string;
  
  // In a real app we'd upload the image here, for now we will just store a placeholder or handle it via a separate endpoint
  
  try {
    const product = await prisma.cropLog.create({
      data: {
        farmer_id: parseInt(session.user.id),
        crop_name,
        quality,
        quantity,
        expected_price,
        location,
      }
    });
    return { success: true, product };
  } catch (error) {
    return { error: "Failed to add product" };
  }
}

export async function getFarmerProducts() {
  const session = await auth();
  if (!session || !session.user.id) return [];

  const products = await prisma.cropLog.findMany({
    where: { farmer_id: parseInt(session.user.id) },
    orderBy: { logged_at: 'desc' }
  });
  
  return products;
}

export async function getProductById(id: number) {
  return await prisma.cropLog.findUnique({
    where: { id },
    include: { farmer: { select: { username: true } } }
  });
}
