"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { IRegisterPayload, IUser } from "@/interfaces";

// 拿使用者的資料並render在頁面上
export const getCurrentUser = async (): Promise<{
  success: boolean;
  data?: IUser;
  message?: string;
}> => {
  try {
    // 1. 建立 Supabase client
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 2. 獲取當前登入的用戶（從 Supabase Auth）
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return {
        success: false,
        message: "Authentication failed. Please login again.",
      };
    }

    if (!authUser) {
      return {
        success: false,
        message: "No authenticated user found.",
      };
    }

    // 3. 從 user-profiles 獲取完整的用戶資料
    const { data: userProfile, error: profileError } = await supabase
      .from("user-profiles")
      .select("*")
      .eq("user_id", authUser.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return {
        success: false,
        message: "Error fetching user profile.",
      };
    }

    if (!userProfile) {
      return {
        success: false,
        message: "User profile not found.",
      };
    }

    // 4. 返回用戶資料（不包含敏感資訊）
    return {
      success: true,
      data: userProfile as IUser,
    };
  } catch (error: unknown) {
    console.error("Unexpected error in getCurrentUser:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

// 判斷有無該使用者並導航到正確頁面
export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<{ success: boolean; message: string; data?: unknown }> => {
  try {
    // 1. 驗證必要欄位
    if (!payload.email || !payload.password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    // 2. 建立 Supabase client
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 3. 使用 Supabase Auth 登入
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

    if (signInError) {
      console.error("Auth signin error:", signInError);
      return {
        success: false,
        message: signInError.message || "Invalid email or password.",
      };
    }

    if (!authData.user) {
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }

    // 4. 驗證 user profile 是否存在
    const { data: userProfile, error: profileError } = await supabase
      .from("user-profiles")
      .select("role")
      .eq("user_id", authData.user.id)
      .single();

    if (profileError || !userProfile) {
      console.error("Profile fetch error:", profileError);
      return {
        success: false,
        message: "User profile not found. Please contact support.",
      };
    }

    return {
      success: true,
      message: "Login successful!",
      data: {
        userId: authData.user.id,
        role: userProfile.role,
      },
    };
  } catch (error: unknown) {
    console.error("Unexpected error in loginUser:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

export const registerUser = async (
  payload: IRegisterPayload
): Promise<{ success: boolean; message: string; data?: unknown }> => {
  try {
    // 1. 驗證必要欄位
    if (!payload.email || !payload.password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    // 2. 建立 Supabase client (server-side)
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 3. 使用 Supabase Auth 註冊（Auth 會自動檢查 email 是否重複）
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });

    if (signUpError) {
      console.error("Auth signup error:", signUpError);
      return {
        success: false,
        message: signUpError.message || "Error creating user account.",
      };
    }

    // 4. 建立 user profile（如果需要額外資料）
    if (authData.user) {
      const { error: profileError } = await supabase
        .from("user-profiles")
        .insert({
          user_id: authData.user.id,
          name: payload.name || "",
          email: payload.email,
          role: "user",
          is_active: true,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);

        // 根據不同錯誤類型提供具體訊息
        let errorMessage = "Profile creation failed. Please contact support.";

        const errorCode = profileError.code;
        const errorMsg = profileError.message?.toLowerCase() || "";

        if (
          errorCode === "23505" ||
          errorMsg.includes("duplicate") ||
          errorMsg.includes("unique")
        ) {
          errorMessage = "A profile with this email already exists.";
        } else if (
          errorMsg.includes("connection") ||
          errorMsg.includes("timeout")
        ) {
          errorMessage = "Database connection issue. Please try again later.";
        }

        return {
          success: false,
          message: errorMessage,
        };
      }
    }

    return {
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      data: { userId: authData.user?.id },
    };
  } catch (error: unknown) {
    console.error("Unexpected error in registerUser:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
