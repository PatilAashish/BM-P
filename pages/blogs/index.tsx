import ShareModal from '@/components/ModalForm/ShareModal/shareModal';
import useToggle from '@/hooks/useToggle';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import Head from 'next/head';
import data from '@/data';
import Spinner, { SpinnerBlog } from '@/components/Spinner';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getBlogData } from '@/services/spot-prices';
import { Blog } from '@/interfaces/typeinterfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
const pageSize = 8;
export default function Blogs({
  title,
  initialBlogs
}: InferGetServerSidePropsType<typeof getServerSideProps> | any) {
  const [shareModal, toggleShareModal] = useToggle();
  const [share, setShare] = useState<any>(window.location.href);
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreBlogs = async () => {
    const nextPage = page + 1;
    const newBlogs = await getBlogData(pageSize, nextPage);
    if (newBlogs.length === 0) {
      setHasMore(false);
    } else {
      setBlogs(prevBlogs => [...prevBlogs, ...newBlogs]);
      setPage(nextPage);
    }
  };
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property='og:url' content={data.WEBSITEUrl + '/blogs'} key={data.WEBSITEUrl + '/blogs'} />
        <link rel='canonical' href={data.WEBSITEUrl + '/blogs'} />
      </Head>
      <div className='text-dark-black'>
        <h1 className='semibold container mx-auto mt-14 text-xl font-medium md:mt-16 md:text-2xl lg:mt-5'>
          Blog
        </h1>
        <InfiniteScroll
          dataLength={blogs.length}
          next={loadMoreBlogs}
          hasMore={hasMore}
          loader={<SpinnerBlog />}
        >
          <section className='container mx-auto mt-14 grid grid-cols-12 gap-4 sm:mt-20 lg:mt-24 xl:mt-24 2xl:mt-28'>
            {blogs.map((blog: Blog) => (
              <Card
                key={blog.id}
                className='col-span-12 mx-auto mt-6 mb-10 h-[22rem] w-full duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md sm:col-span-6 sm:mb-20 sm:mt-6 sm:h-[23rem]
                   lg:col-span-4 lg:mb-20 lg:mt-2 lg:h-96 xl:col-span-4 2xl:col-span-3 2xl:h-[22rem]'
              >
                <Link
                  href={`/blogs/${blog.code}`}
                  as={`/blogs/${blog.code}`}
                  passHref
                  prefetch={false}
                >
                  <CardHeader
                    floated={true}
                    className='mx-1 -mt-16 h-40 shadow-none sm:mt-[-4rem] sm:h-44 md:-mt-20 md:h-48 lg:-mt-[65px] lg:h-52 xl:mx-2 xl:-mt-20'
                  >
                    {' '}
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      className='h-40 w-full rounded-[17px] px-1 sm:h-44 md:h-48 lg:h-48 xl:h-52'
                      height={400}
                      width={400}
                      loading='eager'
                    />
                  </CardHeader>
                  <CardBody className='mt-0 px-4 pt-2 sm:pt-3 md:mt-3 md:pt-2 lg:-mt-2 xl:mt-1'>
                    <h3 className='h-10 text-[1.125rem] font-semibold leading-5 md:h-9'>
                      {blog.title}
                    </h3>
                    <p
                      className='h-10 pt-6 text-[0.95rem] leading-[1.4rem] text-gray-500'
                      dangerouslySetInnerHTML={{
                        __html:
                         (blog.shortDescription.length <= 29)
                            ? blog.shortDescription
                            : blog.shortDescription.slice(0, 100) + '...'
                      }}
                    ></p>
                    <h4 className='pt-24  text-xs font-normal italic text-[#5c5b5b] md:pt-20 lg:pt-24 2xl:pt-[4.5rem]'>
                      By BullionMentor on{' '}
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }).format(new Date(blog.publishdate))}
                    </h4>
                  </CardBody>
                  <CardFooter className='mt-0 flex sm:mt-1 xl:mt-1 2xl:mt-2'>
                    <Link
                      href={`/blogs/${blog.code}`}
                      as={`/blogs/${blog.code}`}
                      className='flex px-4 py-2 font-semibold text-primary shadow-none hover:underline hover:underline-offset-2 md:px-6 md:py-2 md:text-sm lg:px-4 lg:py-1 lg:text-sm'
                      passHref
                      prefetch={false}
                    >
                      Read More
                      <BsArrowRight
                        className='ml-1 text-primary'
                        size={20}
                      ></BsArrowRight>
                    </Link>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </section>
        </InfiniteScroll>
        {shareModal && (
          <ShareModal
            closeModal={toggleShareModal}
            shareUrl={share}
            p1={''}
            p2={''}
          />
        )}
      </div>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader( 'Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59' );
  const pageNumber = 1;
  const initialBlogs = await getBlogData(pageSize, pageNumber);
  const blog = data.site.blog;
  const title = blog.page;
  const description = blog.description;
  return {
    props: {title, description, initialBlogs}
  }
}
