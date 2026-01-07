import Stripe from 'stripe';
import SuccessContent from '@/components/SuccessContent';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getSessionData(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    });

    // Extract downloadUrl from product metadata
    const lineItems = session.line_items?.data;
    let downloadUrl: string | undefined;
    let productName = 'Product';
    let downloadFile: string | undefined;

    if (lineItems && lineItems.length > 0) {
      const firstItem = lineItems[0];
      productName = firstItem.description || firstItem.price?.nickname || 'Product';
      const product = firstItem.price?.product;
      
      console.log('Line item data:', {
        description: firstItem.description,
        priceId: firstItem.price?.id,
        product: product,
        productType: typeof product,
      });
      
      // Handle expanded product object
      if (product && typeof product === 'object' && 'metadata' in product) {
        const productObj = product as Stripe.Product;
        downloadUrl = productObj.metadata?.downloadUrl;
        downloadFile = productObj.metadata?.downloadFile;
        // Use product name if available
        if (productObj.name) {
          productName = productObj.name;
        }
        
        // Debug logging
        console.log('Product metadata (expanded):', {
          downloadUrl,
          downloadFile,
          productName: productObj.name,
          productId: productObj.id,
          allMetadata: productObj.metadata,
        });
      } else if (product && typeof product === 'string') {
        // If product is just an ID, fetch it separately
        try {
          const productObj = await stripe.products.retrieve(product);
          downloadUrl = productObj.metadata?.downloadUrl;
          downloadFile = productObj.metadata?.downloadFile;
          if (productObj.name) {
            productName = productObj.name;
          }
          
          // Debug logging
          console.log('Product metadata (fetched by ID):', {
            productId: product,
            downloadUrl,
            downloadFile,
            productName: productObj.name,
            allMetadata: productObj.metadata,
          });
        } catch (err) {
          console.error('Error fetching product:', err);
        }
      } else {
        // Product might be created dynamically via price_data
        // Try to get product from price
        const priceId = firstItem.price?.id;
        if (priceId) {
          try {
            const price = await stripe.prices.retrieve(priceId, {
              expand: ['product'],
            });
            const priceProduct = price.product;
            
            if (priceProduct && typeof priceProduct === 'object' && 'metadata' in priceProduct) {
              const productObj = priceProduct as Stripe.Product;
              downloadUrl = productObj.metadata?.downloadUrl;
              downloadFile = productObj.metadata?.downloadFile;
              if (productObj.name) {
                productName = productObj.name;
              }
              
              console.log('Product metadata (from price):', {
                priceId,
                downloadUrl,
                downloadFile,
                productName: productObj.name,
                allMetadata: productObj.metadata,
              });
            } else if (priceProduct && typeof priceProduct === 'string') {
              // Product is just an ID, fetch it
              try {
                const productObj = await stripe.products.retrieve(priceProduct);
                downloadUrl = productObj.metadata?.downloadUrl;
                downloadFile = productObj.metadata?.downloadFile;
                if (productObj.name) {
                  productName = productObj.name;
                }
                
                console.log('Product metadata (from price ID):', {
                  productId: priceProduct,
                  downloadUrl,
                  downloadFile,
                  productName: productObj.name,
                  allMetadata: productObj.metadata,
                });
              } catch (err) {
                console.error('Error fetching product from price:', err);
              }
            }
          } catch (err) {
            console.error('Error retrieving price:', err);
          }
        }
        
        console.log('Product is not expanded and not a string ID:', {
          product,
          priceId: firstItem.price?.id,
        });
      }
    } else {
      console.log('No line items found in session');
    }

    // If downloadFile is specified in metadata, use API route
    if (downloadFile && !downloadUrl) {
      downloadUrl = `/api/download?session_id=${sessionId}&file=${encodeURIComponent(downloadFile)}`;
      console.log('Using downloadFile from metadata:', downloadFile);
    }

    // If downloadUrl is a local file (just filename), use API route
    if (downloadUrl && !downloadUrl.startsWith('http') && !downloadUrl.startsWith('/api/')) {
      // Extract filename from downloadUrl (just the filename, no paths)
      const filename = downloadUrl.trim();
      
      // Only convert to API route if it's a .pbix file
      if (filename.endsWith('.pbix') && filename.length > 0 && !filename.includes('/')) {
        downloadUrl = `/api/download?session_id=${sessionId}&file=${encodeURIComponent(filename)}`;
        console.log('Converted filename to API route:', {
          original: downloadUrl,
          filename: filename,
          finalUrl: downloadUrl
        });
      } else {
        console.log('downloadUrl is not a simple .pbix filename:', downloadUrl);
      }
    }

    console.log('Final downloadUrl:', downloadUrl);

    return { downloadUrl, productName };
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
}

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return <SuccessContent variant="no-session" />;
  }

  const sessionData = await getSessionData(sessionId);

  if (!sessionData) {
    return <SuccessContent variant="error" />;
  }

  const { downloadUrl, productName } = sessionData;

  return (
    <SuccessContent
      variant="success"
      downloadUrl={downloadUrl}
      productName={productName}
    />
  );
}
