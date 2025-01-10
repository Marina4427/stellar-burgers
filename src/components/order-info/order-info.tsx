import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderByNumber,
  orderSelectors
} from '../../services/slices/orderSlice';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

// Компонент для отображения информации о заказе.
// Загружает данные о заказе по его номеру и отображает детальную информацию с ингредиентами.
export const OrderInfo: FC = () => {
  const orderData = useSelector(orderSelectors.orderSelector);
  const ingredients: TIngredient[] = useSelector(
    ingredientsSelectors.ingredientsSelector
  );

  // Получаем номер заказа из параметров URL
  const id = useParams().number;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderByNumber(Number(id)));
  }, [dispatch, id]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else acc[item].count++;

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
