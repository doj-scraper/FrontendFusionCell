import { NextResponse } from "next/server";

import { contactFormSchema } from "@/server/validators/contact.validator";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validatedData = contactFormSchema.safeParse(payload);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid contact form payload", details: validatedData.error.format() },
        { status: 400 },
      );
    }

    console.log("Contact form submission:", {
      ...validatedData.data,
      submittedAt: new Date().toISOString(),
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
