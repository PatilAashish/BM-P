/* eslint-disable @next/next/link-passhref */
import TooltipStatus from '@/components/TooltipStatus';
import { selectUser } from '@/features/userSlice';
import { addProdBuyClicksLog } from '@/services/spot-prices';
import { toCurrency } from '@/utils/utilities';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ProductItem } from '@/interfaces/typeinterfaces';

function GridView({
  productId,
  imageUrl,
  mobileImageurl,
  productName,
  shortName,
  competitorProductUrl,
  dealers,
  premium,
  weightCategoryParam,
  cheapestPrice,
  asLowAs,
  dealerId
}: ProductItem) {
  imageUrl =
    imageUrl ||
    'https://res.cloudinary.com/bold-pm/image/upload/q_auto:good/Graphics/no_img_preview_product.png';
  const [tooltipStatus, setTooltipStatus] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const user = useSelector(selectUser);
  useEffect(() => {
    if (user.isLoggedin === false) {
      setCustomerId(0);
    } else {
      setCustomerId(user.user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async () => {
    const response = await addProdBuyClicksLog(
      productName,
      dealers,
      customerId,
      dealerId
    );
  };
  return (
    <div
      key={productId}
      className='relative flex flex-col items-center rounded-[13px] pt-2 pb-3 text-sm shadow-[3px_12px_12px_rgba(0,0,0,0.2)] md:pb-4'
    >
      <div className='items-left mt-5 hidden md:block' id='Desktopview'>
        <Link href={"/" + shortName} aria-label={productName} prefetch={false}>
          <Image
            src={imageUrl}
            alt={productName ?? ''}
            width={500}
            height={500}
            className='md:h-28 md:w-28 lg:h-28 lg:w-28 '
            priority={true}
            loading='eager'
          />
        </Link>
      </div> 
      <div className='float-left mt-20 flex md:hidden' id='Mobileview'>
        <Link href={"/" + shortName} aria-label={productName} prefetch={false}>
          <Image
            src={mobileImageurl}
            alt={productName ?? ''}
            width={200}
            height={200}
            className='-mt-20 h-20 w-20'
            priority={true}
            loading='eager'
          />
        </Link>
      </div> 
      <div
        onMouseEnter={() => setTooltipStatus(3)}
        onMouseLeave={() => setTooltipStatus(0)}
        className='relative mx-3 sm:mx-5 flex justify-center'
      >
        <div className='twoline mr-2 '>
          <Link href={"/" + shortName} aria-label={productName} prefetch={false}>
            <h3 className='my-1 h-10 text-center text-sm font-semibold leading-5 md:mt-4  lg:h-10'>
              {productName.slice(0,25)}...
            </h3>
          </Link>
        </div>
        {tooltipStatus == 3 && (
          <TooltipStatus view='grid' productName={productName} />
        )}
      </div>
      <div className=' flex flex-col items-center px-1  text-sm md:px-4 lg:px-6'>
        <span className='font-medium text-[#AF0E0E]'>
        Premium {toCurrency(asLowAs)}
        </span>
        <span className='font-normal text-[#656565] '>
          <>{dealers ?? '-'}</>
        </span>
        <span className='h-10 text-center font-semibold text-primary md:h-9 lg:h-6'>
          As low as {toCurrency(cheapestPrice)}
        </span>

        <div className='-mt-3  w-full flex-1 items-end gap-2 px-3 text-center lg:ml-3 lg:mr-3  lg:items-center lg:px-6'>
          <div className='absolute mt-5 ml-2 flex h-full w-24 items-center justify-center border-t-2 border-gray-300 sm:ml-4 lg:ml-0'></div>

          <div className='mt-6 w-full'>
            <div className=' justify-center'>
              <Link
                href={"/" + shortName}
                className='group relative inline-flex items-center justify-center  overflow-hidden font-semibold text-blue-500 underline decoration-blue-500 hover:underline '
                aria-label={`Compare ${productName}`}
                prefetch={false}
              >
                <button className='items-center hover:text-[#0F4463]'>
                  Compare
                </button>
              </Link>

              <div className='relative'>
                <div className='absolute mt-1 h-full border-l-2 border-gray-300'></div>
              </div>
              <Link
                target={'_blank'}
                href={competitorProductUrl}
                aria-label={`Buy ${productName}`}
                prefetch={false}
                onClick={addProduct}
                className='group relative inline-block w-full overflow-hidden rounded-full bg-primary px-5 py-2 font-medium text-white'
              >
                <span className='absolute top-0 left-0 mb-0 flex h-0 w-full translate-y-0 transform bg-secondary opacity-90  transition-all duration-300 ease-out group-hover:h-full'></span>
                <span className='relative'>Buy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetaildView({
  productId,
  imageUrl,
  mobileImageurl,
  productName,
  shortName,
  competitorProductUrl,
  dealers,
  premium,
  weightCategoryParam,
  cheapestPrice,
  shortDescription,
  asLowAs,
  dealerId
}: ProductItem) {
  imageUrl =
    imageUrl ||
    'https://res.cloudinary.com/bold-pm/image/upload/q_auto:good/Graphics/no_img_preview_product.png';
  shortDescription = shortDescription || '';
  const [tooltipStatus, setTooltipStatus] = useState(0);
  const productNamenew = productName;
  const productNameSlice = productNamenew?.slice(0, 49) + '...';
  const [customerId, setCustomerId] = useState(0);
  const user = useSelector(selectUser);
  
  useEffect(() => {
    if (user.isLoggedin === false) {
      setCustomerId(0);
    } else {
      setCustomerId(user.user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async () => {
    const response = await addProdBuyClicksLog(
      productName,
      dealers,
      customerId,
      dealerId
    );
  };
  return (
    <>
      <div
        key={productId}
        className='relative grid h-50 grid-cols-4 rounded-[13px] px-1 text-sm shadow-[0px_3px_3px_rgba(0,0,0,0.16)] sm:h-50 lg:h-[228px] xl:h-52 2xl:h-[200px] pb-2'
      >
      <div
          className='items-left col-span-1 hidden py-2 md:block'
          id='desktopview'
        >
          <Link href={"/" + shortName} aria-label={productName} prefetch={false}>
            <Image
              src={imageUrl}
              alt={productName ?? ''}
              width={500}
              height={500}
              className='sm:h-28 md:h-auto'
              priority={true}
              loading='eager'
            />
          </Link>
        </div>
        <div className='flex md:col-span-1 md:hidden md:py-2' id='mobileview'>
          <Link href={"/" + shortName} aria-label={productName} prefetch={false}>
            <Image
              src={mobileImageurl}
              alt={productName ?? ''}
              width={100}
              height={100}
              className='h-auto w-auto'
              priority={true}
              loading='eager'
            />
          </Link>
        </div>
        <div className='col-span-3 mt-2 ml-2'>
          <div
            onMouseEnter={() => setTooltipStatus(3)}
            onMouseLeave={() => setTooltipStatus(0)}
            className='relative cursor-pointer'
          >
            <div className='mr-2 h-16 sm:h-6 lg:h-10'>
              <div className='oneline'>
                <Link
                  href={"/" + shortName}
                  aria-label={productName}
                  prefetch={false}
                >
                  <h3 className='mt-0 hidden h-10 text-sm font-semibold leading-5 sm:h-6  md:mt-2 md:block lg:mt-1 lg:h-5'>
                    {`${productName.length > 28 ? productName.slice(0, 28)+'...': productName}`}
                  </h3>
                </Link>
              </div>
              <h3 className='mt-0  h-10 text-sm font-semibold sm:h-6 md:mt-4 md:hidden lg:mt-1 lg:h-8'>
                {productNameSlice}
              </h3>
              <div className='twoline'>
                <article className='text-normal mt-3 leading-4 text-[#404040] sm:mt-1 md:text-sm md:leading-4 lg:mt-6 lg:leading-4 xl:mt-2 2xl:mt-1 2xl:leading-5'>
                  {shortDescription.slice(0,65)}...
                </article>
              </div>
            </div>
            {tooltipStatus == 3 && (
              <TooltipStatus view='detailed' productName={productName} />
            )}
          </div>
          <div className='mx-auto mt-8 flex flex-col justify-start text-sm sm:mt-12 lg:mt-14 xl:mt-9 2xl:mt-7'>
            <span className='font-medium text-[#AF0E0E]'>
             Premium {toCurrency(asLowAs)}
            </span>
            <span className='font-normal text-[#656565]'>
              <>{dealers ?? '-'}</>
            </span>
            <span className='font-semibold text-primary'>
              As low as {toCurrency(cheapestPrice)}
            </span>
            <div className='mx-auto mt-2 hidden w-full gap-2 px-2 sm:flex'>
              <div className='w-full rounded border-t-2 border-gray-300'>
                <div className='mt-2 flex justify-start'>
                  <Link
                    href={"/" + shortName}
                    className='group relative inline-flex w-full items-center justify-center overflow-hidden font-semibold text-blue-500 underline decoration-blue-500 hover:text-[#0F4463] hover:underline'
                    aria-label={`Compare ${productName}`}
                    prefetch={false}
                  >
                    Compare
                  </Link>

                  <div className='relative'>
                    <div className='absolute mt-1 h-full w-full border-l-2 border-gray-300'></div>
                  </div>
                  <Link
                    target={'_blank'}
                    href={competitorProductUrl}
                    aria-label={`Buy ${productName}`}
                    prefetch={false}
                    onClick={addProduct}
                    className='group relative ml-4 inline-block w-full overflow-hidden rounded-full bg-primary px-5 py-2 pl-20 font-medium text-white sm:pl-24 md:pl-20 lg:pl-12 xl:pl-16 2xl:pl-20 '
                  >
                    <span className='absolute top-0 left-0  mb-0 flex h-0 w-full translate-y-0 transform bg-secondary opacity-90 transition-all duration-300 ease-out group-hover:h-full '></span>
                    <span className='relative '>Buy</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='justify-left mt-1 flex-1 gap-2 sm:hidden'>
            <Link
              href={"/" + shortName}
              className='items-left justify-left  group relative ml-2 inline-flex w-full overflow-hidden font-semibold text-blue-500 underline decoration-blue-500 hover:underline '
              aria-label={`Compare ${productName}`}
              prefetch={false}
            >
              Compare
            </Link>
            <Link
              target={'_blank'}
              href={competitorProductUrl}
              className='items-left group relative mt-1 inline-flex justify-start overflow-hidden rounded-full bg-primary px-9 py-2 text-white xl:ml-4 '
              aria-label={`Buy ${productName}`}
              prefetch={false}
              onClick={addProduct}
            >
              Buy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default function TopProductItem({
  view,
  ...props
}: ProductItem & {
  view: 'detailed' | 'grid';
}) {
  
  const trendingProductsSchema = () => {
    return {
      __html: `{
        "@context" : "https://schema.org",
        "@type":"ItemList",

      }`
    }
  }
  return view === 'grid' ? <GridView {...props} /> : <DetaildView {...props} />;
}
