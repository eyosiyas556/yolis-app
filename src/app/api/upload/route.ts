import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "kqo13l3d";
    const apiKey = process.env.CLOUDINARY_API_KEY || "273665548141231";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "iOO1ciNdWwfBRrMPGn2qYi-fR8E";

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Stream binary directly to Cloudinary without base64 overhead
    const bytes = await file.arrayBuffer();
    const mimeType = file.type || "image/jpeg";
    const fileBlob = new Blob([bytes], { type: mimeType });

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "yolanda_salon_equipment";

    // Cloudinary signature: parameters in alphabetical order
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

    // Upload directly as binary multipart to Cloudinary API
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", fileBlob, file.name || "image.jpg");
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", String(timestamp));
    cloudinaryFormData.append("folder", folder);
    cloudinaryFormData.append("signature", signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error("Cloudinary upload failed:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to upload image to Cloudinary." },
        { status: uploadRes.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url || data.url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during upload." },
      { status: 500 }
    );
  }
}
