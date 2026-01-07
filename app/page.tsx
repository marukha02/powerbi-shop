import ProductCard from '@/components/ProductCard';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getProducts() {
  try {
    const products = await stripe.products.list({
      expand: ['data.default_price'],
      active: true,
    });

    return products.data
      .filter((product) => product.default_price) // Only include products with a price
      .map((product) => {
        const price = product.default_price as Stripe.Price;
        return {
          id: product.id,
          title: product.name,
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          stripePriceId: price.id,
          stripeProductId: product.id,
          image: product.images && product.images.length > 0 ? product.images[0] : '/product-placeholder.jpg',
          demoUrl: product.metadata?.demoUrl,
        };
      });
  } catch (error) {
    console.error('Error fetching products from Stripe:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Professional Power BI Templates
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Transform your data into actionable insights with our premium Power BI templates
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
