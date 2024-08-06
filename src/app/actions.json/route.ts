import { createActionHeaders, type ActionsJson } from "@solana/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const payload: ActionsJson = {
        rules: [
            // map all root level routes to an action
            {
                pathPattern: "/*",
                apiPath: "/api/actions/*",
            },
            // idempotent rule as the fallback
            {
                pathPattern: "/api/actions/**",
                apiPath: "/api/actions/**",
            },
        ],
    };

    return Response.json(payload, {
        headers: createActionHeaders(),
    });

}