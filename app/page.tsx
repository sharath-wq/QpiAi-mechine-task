import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to <span className="text-blue-600">QpiAi!</span>
        </h1>
        <p className="text-lg text-gray-700 text-center sm:text-left">
          Dashboard <code className="bg-gray-100 rounded px-2 py-1 font-mono"><Link href={'/dashboard'}>/dashboard</Link></code>
        </p>
        <p className="text-lg text-gray-700 text-center sm:text-left">
          Upload Page <code className="bg-gray-100 rounded px-2 py-1 font-mono"><Link href={'/upload'}>/upload</Link></code>
        </p>
      </main>
    </div>
  );
}
