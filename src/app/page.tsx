import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 dark:bg-black">
      <h1 className="text-5xl">
        DISCIPLINA · VIRTUS · FERRUM
        {/* Make the vow. */}
      </h1>
      {/* <p className="text-4xl text-muted-foreground">Lift the iron.</p> */}
    </div>
  );
}
