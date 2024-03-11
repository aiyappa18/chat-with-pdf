import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from 'lucide-react'
import FileUpload from "@/components/ui/FileUpload";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chats } from "@/lib/db/schema";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  let firstChat;
  if(userId)
  {
    firstChat=await db.select().from(chats).where(eq(chats.userId,userId))
    if(firstChat)
    {
      firstChat=firstChat[0];
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-purple-400 via-teal-500 to-pink-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-4">
            {isAuth && firstChat && 
            <Link href={`/chat/${firstChat.id}`}>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Go to Chats
              </Button>
              </Link>
            }
          </div>
          <p className="max-w-xl mt-4 text-lg text-white">
          Immerse yourself in the seamless integration of technology as you unleash the power of AI. Upload PDFs and engage in dynamic conversations directly within the documents themselves.
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) :
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
