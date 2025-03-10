import Link from "next/link";

export default function Home() {
  return (
   <div className="bg-black bg-home-img bg-cover bg-center">

    <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">

      <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/40 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl">
        <h1 className="text-4-xl font-bold">Test Shop</h1>
        <address>
          Panepistimiou 55<br />
          Athens 13078
        </address>
        <p>
          Open Daily: 9am - 5pm
        </p>
        <Link href='tel:2103821587' className="hover:underline">
          2103821587
        </Link>
      </div>

    </main>
   </div>
  );
}
