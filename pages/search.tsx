import EmptyCard from '@/components/EmptyCard';
import TopProductItem from '@/containers/home/TopProductItem';
import { search } from '@/services/dashboard';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoGridSharp } from 'react-icons/io5';
import { GridViewSkeleton } from '@/components/Loaders/Grid/GridViewSkeleton';
import SearchSpinner from '@/components/Loaders/SearchSpinner';
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_SIZE = 12;

export default function Search({
  title,
  description,
  product: initialProducts,
  query
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [view, setView] = useState<'detailed' | 'grid'>('grid');
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [fetchedProducts, setFetchedProducts] = useState(
    initialProducts.data.searchProducts
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); 
const Length = initialProducts.data.countOfProducts.numberOfPages;
  const fetchMoreProducts = async () => {
    try {
      const nextPage = page + 1;
      const newProducts = await search(query, PAGE_SIZE, nextPage);
      setFetchedProducts((prevProducts: any) => [
        ...prevProducts,
        ...newProducts.data.searchProducts
      ]);
      setPage(nextPage);
      if (
        newProducts.data.searchProducts.length === 0 ||
        fetchedProducts.length >= newProducts.data.countOfProducts.noOfItems
      ) {
        return;
      }
    } catch (error) {
      console.error('Error fetching more products:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Set loading state to true when fetching new products
        const newProducts = await search(query, PAGE_SIZE, 1);
        setProducts(newProducts);
        setFetchedProducts(newProducts.data.searchProducts);
        setPage(1);
        setHydrated(true);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Reset loading state when fetching is done
      }
    };

    fetchProducts();
  }, [query]);

  useEffect(() => {
    setHydrated(true);
  }, [products]);

  useEffect(() => {
    setCanonicalUrl(window.location.href.toString());
  });
  /**************** IF PRODUCTS ARE AVAILABLE ****************/
  return (
    <>

      {/**************** META TAGS ****************/}
      <Head>
        <title>{title}</title>
        <meta name='og:type' content={initialProducts.data.content.metaTitle} />
        <link rel='canonical' href={canonicalUrl} />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org/',
              '@type': 'ItemList',
              mainEntityOfPage: {
                '@type': 'CollectionPage',
                '@id': 'https://www.bullionmentor.com/'
              },
              numberOfItems: initialProducts.data.countOfProducts.noOfItems,
              itemListElement: initialProducts.data.searchProducts.map(
                (product: any, index: number) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Product',
                    url:
                      'https://www.bullionmentor.com/' +
                      initialProducts.shortName,
                    name: product.productName,
                    description: product.shortDescription,
                    image: initialProducts.imageUrl,
                    category: [
                      initialProducts.productName,
                      'https://www.bullionmentor.com/' +
                        initialProducts.shortName
                    ],
                    sku: product.sku,
                    weight: initialProducts.weight,
                    depth: initialProducts.depth,
                    width: initialProducts.width,
                    material: initialProducts.data.inputfields.metal,
                    brand: { '@type': 'Brand', name: 'US Mint' }
                  }
                })
              )
            })
          }}
        />

        <script
          async
          defer
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org',
              '@type': 'WebSite',
              url: 'https://www.bullionmentor.com/',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${
                  'https://www.bullionmentor.com/search?q=' +
                  initialProducts.data.inputfields.searchKW
                }`,
                'query-input': `${
                  'required name=' + initialProducts.data.inputfields.searchKW
                }`
              }
            })
          }}
        />
      </Head>
      <div className='bg-gradient-to-b from-secondary via-white to-white text-dark-black'>
        {/***************** SEO CONTENT TOP *****************/}
        <div className='container mx-auto py-8 md:mt-2 lg:mt-1'>
          <h1 className='mb-2 mt-3 text-lg font-bold md:text-xl lg:mt-0'>
            {initialProducts.data.content.title
              ? initialProducts.data.content.title
              : ''}
          </h1>
          <h2
            id='innerText'
            className='text-sm text-slate-600  md:text-base'
            dangerouslySetInnerHTML={{
              __html: initialProducts.data.content
                ? initialProducts.data.content.seoContent
                : ''
            }}
          ></h2>
        </div>
      </div>
      {/***************** PAGE CONTENT *****************/}
      {hydrated === false ? (
        <SearchSpinner />
      ) : (
        <div className='container mx-auto text-dark-black'>
          <div className='md:flex md:flex-row'>
            <div className='md:flex-1 md:w-[80%]'>
              <div className='flex flex-col gap-2 md:grid md:grid-cols-4'>
                {/***************** LEFT ADVERTISEMENT *****************/}
                <div className='flex-col gap-4 md:static md:top-[32px] md:h-fit lg:flex'>
                  <div className='flex w-full items-center justify-center rounded-md'>
                    <Image
                      src='https://res.cloudinary.com/bullionmentor/image/upload/Banners/Where-Beauty-Meets-Value_ig2c4a.webp'
                      alt=''
                      height={350}
                      width={350}
                      className='rounded-lg'
                      loading='lazy'
                    />
                  </div>
                  <div className='flex  w-full items-center justify-center rounded-md'>
                    <Image
                      src='https://res.cloudinary.com/bullionmentor/image/upload/Banners/United-States-Mint_cemody.jpg'
                      alt=''
                      height={350}
                      width={350}
                      className='rounded-lg pt-4 lg:pt-0'
                      loading='lazy'
                    />
                  </div>
                </div>
                {/***************** PAGE CONTENT *****************/}
                <div className='col-span-3 mx-0 grow gap-0 lg:mx-4 lg:gap-4'>
                  {/***************** VIEW TOGGLE BUTTONS *****************/}
                  <div className='mb-4 hidden justify-end gap-6 md:flex'>
                    {/***************** DETAIL VIEW BUTTON *****************/}
                    <button
                      onClick={() => setView('detailed')}
                      className={`flex items-center gap-2 px-4 py-2 ${view === 'detailed'
                        ? 'rounded-md bg-primary text-white'
                        : 'bg-white'
                        }`}
                    >
                      <GiHamburgerMenu size={25} />
                      <span>Detailed View</span>
                    </button>
                    {/***************** GRID VIEW BUTTON *****************/}
                    <button
                      onClick={() => setView('grid')}
                      className={`flex items-center gap-2 px-4 py-2 ${view === 'grid'
                        ? 'rounded-md bg-primary text-white'
                        : 'bg-white'
                        }`}
                    >
                      <IoGridSharp size={25} />
                      <span>Grid View</span>
                    </button>
                  </div>
                  {/***************** PRODUCT LIST *****************/}
                  <>
                  {loading ? (   
        <SearchSpinner /> 
      ) : (
        <Suspense fallback={<GridViewSkeleton />}>
        {initialProducts.data.countOfProducts.noOfItems === 0 ? (
          <EmptyCard />
        ) : (
          <>
              <InfiniteScroll
                className='overflow-hidden'
                dataLength={fetchedProducts.length}
                next={fetchMoreProducts}
                hasMore={
                  fetchedProducts.length <
                  initialProducts.data.countOfProducts.noOfItems
                }
                loader={page <
                  Length?<SearchSpinner />:""}
                scrollThreshold={0.3}
              >
                <div
                  className={`mb-5  grid gap-4 ${
                    view === 'detailed'
                      ? 'grid-cols-1 xl:grid-cols-2'
                      : 'grid-cols-2 xl:grid-cols-3'
                  }`}
                >
                  {fetchedProducts.map((product: any) => (
                    <TopProductItem
                      view={view}
                      key={product.productId}
                      {...product}
                    />
                  ))}
                </div>
              </InfiniteScroll>
          </>
        )}
      </Suspense>
       )}
       </>
                </div>


                {/***************** SEO CONTENT BOTTOM *****************/}
                <div
                  className={`text-justify' container mx-auto mt-10 md:col-span-4 md:relative text-sm text-slate-600 md:mt-5  md:text-base`}
                >
                  <span
                    id='innerText'
                    dangerouslySetInnerHTML={{
                      __html: initialProducts.data.content.seoContentBottom
                        ? initialProducts.data.content.seoContentBottom
                        : ''
                    }}
                  ></span>
                </div>
              </div>

            </div>
            <div className='md:flex-2 md:w-[20%] md:ml-4'>
              {/***************** RIGHT ADVERTISEMENT *****************/}
              <div className='flex-col gap-4 pt-6 md:pt-0 md:sticky  md:top-32  md:flex md:h-fit'>
                <div className='flex  w-full items-centers  justify-center rounded-md'>
                  <Image
                    src='https://res.cloudinary.com/bullionmentor/image/upload/Banners/Bullion-Mentor-motive_anp3hj.webp'
                    alt=''
                    height={500}
                    width={500}
                    className='rounded-lg'
                    loading='lazy'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  title: any;
  description: any;
  product: Awaited<ReturnType<typeof search>>;
  query: any;
}> = async ({ query }) => {
  const pageNumber = 1;
  const product = await search(query, PAGE_SIZE, pageNumber);
  const title = product.data.content.metaTitle;
  const description = product.data.content.metaDesc;
  return {
    props: {
      title,
      description,
      query,
      product
    }
  };
};
