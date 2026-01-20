"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// 把前端上傳的檔案傳到 Supabase Storage，然後回傳對應的公開 URL。
export const uploadFilesAndGetUrls = async (files: File[]) => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const uploadedFileUrls: string[] = [];

    for (const file of files) {
      // Generate unique filename with proper extension handling
      const fileNameParts = file.name.split(".");
      const fileExt = fileNameParts.length > 1 ? fileNameParts.pop() : "";

      // Use crypto.randomUUID() for high-entropy unique identifier
      const uniqueId = crypto.randomUUID();
      const fileName = fileExt
        ? `${Date.now()}-${uniqueId}.${fileExt}`
        : `${Date.now()}-${uniqueId}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("events")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("events").getPublicUrl(data.path);

      uploadedFileUrls.push(publicUrl);
    }

    return {
      success: true,
      message: "Files uploaded successfully",
      urls: uploadedFileUrls,
    };
  } catch (error) {
    return {
      success: false,
      message: "File upload failed: " + (error as Error).message,
    };
  }
};
