import {Image} from '@shopify/hydrogen';
import {Link, useLoaderData} from 'react-router';
import {LoaderFunctionArgs, type MetaFunction} from 'react-router';
import {useVariantUrl} from '~/lib/variants';

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

  return {user};
}

export default function User() {
  const {user} = useLoaderData<typeof loader>();
  return <></>;
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
