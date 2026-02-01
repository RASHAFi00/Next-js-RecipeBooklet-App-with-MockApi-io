export default function RecipesPage() {
  return (
    <div className="flex gap-8 max-w-7xl">
      {/* FILTER ASIDE */}
      <aside className="w-80 bg-[var(--card-bg)] p-[var(--padding)]   sticky top-[var(--padding)] h-fit">
        <h2 className="text-xl font-bold mb-6">Filters</h2>
        <div className="space-y-4">
          <input 
            placeholder="Search recipes..." 
            className="w-full p-3 rounded-full border border-[var(--text-secondary)]/50 focus:border-[var(--accent)] outline-none"
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Rating</label>
            <input type="range" min="0" max="5" className="w-full h-2 bg-[var(--text-secondary)]/20 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Prep Time</label>
            <input type="range" min="5" max="120" className="w-full h-2 bg-[var(--text-secondary)]/20 rounded-lg cursor-pointer" />
          </div>
        </div>
      </aside>
      
      {/* RECIPES GRID */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[var(--title-size)] font-bold">All Recipes</h1>
          <span className="text-sm text-[var(--text-secondary)]">25 recipes</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <RecipeCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecipeCard() {
  return (
    <div className="group bg-[var(--card-bg)] rounded p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-transparent hover:border-[var(--accent)]/30">
      <div className="w-full h-48 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--success)]/10 
                     rounded mb-4 overflow-hidden flex items-center justify-center text-sm 
                     text-[var(--text-secondary)] border-2 border-dashed border-[var(--accent)]/30">
        [RECIPE IMAGE]
      </div>
      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-[var(--text-primary)]">Delicious Pasta Recipe</h3>
      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">Amazing pasta with fresh ingredients...</p>
      <div className="flex items-center justify-between mb-6">
        <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs rounded font-medium">
          ⭐ 4.8 (124)
        </span>
        <span className="text-sm text-[var(--text-secondary)] font-medium">25 min</span>
      </div>
      <button className="w-full p-3 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] rounded font-medium transition-all group-hover:scale-[1.02] border border-[var(--accent)]/20">
        ❤️ Add to Favorites
      </button>
    </div>
  );
}
