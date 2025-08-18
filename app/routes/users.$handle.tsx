import {LoaderFunctionArgs, type MetaFunction} from 'react-router';

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
  return {};
}

export default function User() {
  return <></>;
}
