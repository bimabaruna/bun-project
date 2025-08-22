// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          POS Pro System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Complete Point of Sale solution for your business
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-gradient-primary rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-2">POS Terminal</h3>
            <p className="mb-4">Quick sales and order processing</p>
            <a href="/pos" className="inline-block bg-white text-primary px-4 py-2 rounded font-medium">
              Open POS
            </a>
          </div>
          <div className="p-6 bg-gradient-success rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-2">Back Office</h3>
            <p className="mb-4">Manage products, users, and analytics</p>
            <a href="/dashboard" className="inline-block bg-white text-accent px-4 py-2 rounded font-medium">
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
