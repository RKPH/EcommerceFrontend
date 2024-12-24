<ul className="flex gap-x-4 w-full bg-white font-[AdihausDIN] text-base font-bold">
  {categories.map((category) => (
    <li
      key={category}
      className={`p-3 border border-black cursor-pointer ${
        selectedCategory === category
          ? "bg-black text-white"
          : "hover:bg-black hover:text-white"
      }`}
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </li>
  ))}
</ul>;

{
  /* Product List with Navigation */
}
<div className="flex w-full items-center justify-center mt-2 relative">
  {showPrev && (
    <button
      onClick={scrollLeft}
      className="absolute left-0 z-10 p-4 px-5 bg-white text-black border border-black"
    >
      <ArrowBackIcon />
    </button>
  )}

  <ul
    ref={listRef}
    onScroll={handleScroll}
    className="flex gap-x-4 overflow-x-auto w-full py-2 min-h-fit flex-nowrap custom-scrollbar"
  >
    {products.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
  </ul>

  {showNext && (
    <button
      onClick={scrollRight}
      className="absolute right-0 z-10 p-4 px-5 bg-white text-black border border-black"
    >
      <ArrowForwardIcon />
    </button>
  )}
</div>;
