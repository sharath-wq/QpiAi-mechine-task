export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to <span className="text-blue-600">FileRBAC!</span>
        </h1>
        <p className="text-lg text-center sm:text-left max-w-2xl">
          FileRBAC is your go-to platform for seamless file uploads and management. 
          Easily upload images and data files, and let our AI-powered tools help you analyze and visualize your data effortlessly.
        </p>
  
      </main>
    </div>
  );
}
