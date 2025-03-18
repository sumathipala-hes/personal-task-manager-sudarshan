import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<
  { success: true; data: T } | { success: false; error: NextResponse }
> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json({ error: "Invalid request" }, { status: 400 }),
    };
  }
}

export async function validateQueryParams<T>(
  params: URLSearchParams,
  schema: ZodSchema<T>
): Promise<
  { success: true; data: T } | { success: false; error: NextResponse }
> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryObject: Record<string, any> = {};
    params.forEach((value, key) => {
      queryObject[key] = value;
    });

    const data = schema.parse(queryObject);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      ),
    };
  }
}
