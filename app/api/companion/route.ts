import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing fields", { status: 400 });
        }
          

        const companion = await prismadb.companion.create({
            data: {
                userId: user.id,
                userName: user.firstName,
                categoryId,
                description,
                instructions,
                name,
                seed,
                src,
            }
          });

        return NextResponse.json(companion);
    } catch (error: any) {
        console.error("[COMPANION_POST]", error.message, error.stack);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
