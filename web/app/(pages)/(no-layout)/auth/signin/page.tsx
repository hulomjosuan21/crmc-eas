import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import loginImage from "@/public/images/29710497_7603329.jpg";
import { SignInClient } from "./SigninClient";

export default function page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            School-EAS.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInClient />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={loginImage}
          alt="Image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
