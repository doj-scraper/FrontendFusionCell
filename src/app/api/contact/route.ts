import { NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Store the contact submission in a database
    // 2. Send an email notification to the support team
    // 3. Send a confirmation email to the user
    
    // For now, we'll just log the submission and return success
    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      submittedAt: new Date().toISOString(),
    });

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
