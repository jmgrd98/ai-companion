import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { companionId: string } } ) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if (!params.companionId) return new NextResponse("Companion ID is required", { status: 400 })

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing fields", { status: 400 });
        }
          

        const companion = await prismadb.companion.update({
            where: {
              id: params.companionId  
            },
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
        console.error("[COMPANION_PATCH]", error.message, error.stack);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { companionId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const companion = await prismadb.companion.delete({
            where: {
                userId,
                id: params.companionId
            }
        });

        return NextResponse.json(companion);
    } catch (error: any) {
        console.error("[COMPANION_DELETE]", error.message, error.stack);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
