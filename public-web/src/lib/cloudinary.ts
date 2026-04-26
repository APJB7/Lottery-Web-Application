import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadProofToCloudinary(filePath: string, referenceCode: string) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "luckyflow/payment-proofs",
    public_id: `${Date.now()}-${referenceCode}`,
    resource_type: "auto",
  });

  return result.secure_url;
}