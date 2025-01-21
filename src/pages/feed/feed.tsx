import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedSelectors, getFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(feedSelectors.ordersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  if (!orders.length) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeed())} />;
};
