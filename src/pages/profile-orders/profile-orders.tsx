import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders, orderSelectors } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(orderSelectors.ordersSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
