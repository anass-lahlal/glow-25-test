import {Image} from '@shopify/hydrogen';
import {Link, useLoaderData} from 'react-router';
import {LoaderFunctionArgs, type MetaFunction} from 'react-router';
import {useVariantUrl} from '~/lib/variants';

import fallbackImage from '../assets/profile-fallback.svg';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | Users`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args);

  return {...criticalData};
}

async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const {user} = await storefront.query(USER_METAOBJECT, {
    variables: {handle: {handle: handle!, type: 'users'}},
  });

  if (!user) {
    throw new Response(null, {status: 404});
  }

  return {user};
}

export default function User() {
  const {user} = useLoaderData<typeof loader>();
  const variantUrl = useVariantUrl(user?.product?.reference?.handle as string);

  return (
    <section className="user-container">
      <div className="user-info">
        <h3 className="user-name">
          Welcome <strong>{user?.firstName?.value}</strong>,
        </h3>
        <Image
          className="user-avatar"
          data={{...user?.image?.reference?.image}}
          src={user?.image?.reference?.image?.url ?? fallbackImage}
          width={64}
        />
      </div>

      {user?.product ? (
        <div className="user-recommendation">
          <div className="user-product-info-container">
            <span className="user-recommendation-title">
              Recommended for you
            </span>
            <div className="user-product-info">
              <h4 className="user-product-title">
                {user?.product?.reference?.title}
              </h4>
              <p className="user-product-description">
                {user?.product?.reference?.description}
              </p>
              <Link
                className="user-product-cta"
                prefetch="intent"
                to={variantUrl}
              >
                View product
              </Link>
            </div>
          </div>

          <Image
            aspectRatio="1/1"
            className="user-product-image"
            data={{...user?.product?.reference?.featuredImage}}
            width={400}
          />
        </div>
      ) : (
        <div className="user-recommendation" style={{justifyContent: 'center'}}>
          <span className="user-recommendation-title">
            Product recommendation unavailable
          </span>
        </div>
      )}
    </section>
  );
}

const USER_METAOBJECT = `#graphql
  fragment ImageDetails on Image {
    id
    url
    altText
    width
    height
  }

  query UserData(
    $handle: MetaobjectHandleInput!
  ) {
        user: metaobject(handle: $handle) {
            firstName: field(key: "first_name") {
                value
            }
            image: field(key: "profile_image") {
                ... on MetaobjectField {
                    reference {
                        ... on MediaImage {
                            image {
                                ... ImageDetails
                            }
                        }
                    }
                }
            }
            product: field(key: "assigned_product") {
                ... on MetaobjectField {
                    reference {
                        ... on Product {
                            title
                            description
                            handle
                            featuredImage {
                                ... ImageDetails
                            }
                        }
                    }
                }
            }
        }
    }
` as const;
