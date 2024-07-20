function MyListLoader() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="mt-4 h-40 w-full rounded-md bg-bgwhite"
        ></div>
      ))}
    </>
  );
}

export default MyListLoader;
