import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { feedSelectors } from '../../services/slices/feedSlice';

// Функция для получения номеров заказов по их статусу.
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// Компонент для отображения информации о ленте заказов.
// Подсчитывает количество выполненных и ожидающих заказов и отображает общую информацию о ленте.
export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(feedSelectors.ordersSelector);
  const feed = {
    total: useSelector(feedSelectors.totalSelector),
    totalToday: useSelector(feedSelectors.totalTodaySelector)
  };
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
