export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className=" p-12 text-center ">
        <h1 className="text-[var(--title-size)] font-bold text-[var(--text-primary)] mb-4">
          Welcome to Recipe Kitchen
        </h1>
        <p className="text-[var(--desc-size)] text-[var(--text-secondary)] max-w-md mx-auto">
          Discover amazing recipes from our community of chefs. 
          Sign in to save favorites or share your own creations!
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="/recipes" className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-medium hover:bg-[var(--accent)]/90">
            Browse Recipes
          </a>
          <a href="/login" className="px-8 py-3 border border-[var(--accent)] text-[var(--accent)] rounded-full font-medium hover:bg-[var(--accent)] hover:text-white">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
