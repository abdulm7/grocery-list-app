type HeaderProps = {
  purchasedCount: number;
  totalCount: number;
};

export const Header = ({ purchasedCount, totalCount }: HeaderProps) => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-2 py-4 md:px-4 md:py-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Grocery List</h1>
          <div className="text-sm text-muted-foreground">
            {purchasedCount} of {totalCount} purchased
          </div>
        </div>
      </div>
    </header>
  );
};
